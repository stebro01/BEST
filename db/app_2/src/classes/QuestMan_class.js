import { log } from 'src/tools/logger'
// v20240103 copied from surveyBEST

// USAGE:
// IMPORT
// import { QUESTMAN } from "../../../src/tools/QuestMan"
// FUNCTIONS
// QUESTMAN.check() >> returns true
// QUESTMAN.quest_list >> returns a list with all quests >> ['bfi', 'nihss' ...]
// QUESTMAN.get() >> returns all laded QUESTS
// QUESTMAN.get('bdi2') >> returns sthe specified QUEST
// QUESTMAN.activeQuest = 'bdi2' >> sets the active QUEST
// QUESTMAN.activeQuest >> returns the active quest {label: 'bdi2', value: QUEST[bdi2]} or undefined
// QUESTMAN.result >> returns results from the active QUEST or undefined
// QUESTMAN.random_fill >> fills the active Qeust with random values
//
//* Adding a simple Quest:
// QUESTMAN.clear_preset()
// QUESTMAN.preset = 'bdi2'
// QUESTMAN.next() >> will move next preset to QUESTMAN.activeQuest
//
//
// UNIT TESTING: questman.test.js

export class QuestMan {
    _QUESTS = undefined
    _activeQuest = undefined
    _presets = []
    _fieldname = 'surveyBEST_QUESTS'
  
    constructor(payload) {
      log({message: 'QuestMan initializing ...', data: payload})
      if (payload && payload.init === false) {
        // do nothing
        return
      } 
      else this._load()
    }
  
    _load() {
      log({ message: 'load quest' })
      // load from storage
      const data = JSON.parse(localStorage.getItem(this._fieldname))
      if (data === null || data === undefined) return this._init()
      this._QUESTS = data
    }
  
    _save() {
      log({ message: 'save quest' })
      localStorage.setItem(this._fieldname, JSON.stringify(this._QUESTS))
    }
  
    _init() {
      // log({ message: 'init quest' })
      // this._QUESTS = {}
      // const quests = QUESTS()
      // quests.forEach(q => {
      //   try {
      //     let Q = require(`assets/questionnaires/quest_${q}.json`)
      //     this._add(Q)
      //   } catch (e) {
      //     log({ error: "QuestMan>_init", data: e })
      //   }
      // })
      // this._save()
    }
  
    //   QUEST FUNCTIONS
    get quest_list() {
      return Object.keys(this._QUESTS);
    }
  
    quest_list_filtered(filter_value) {
      const list = []
      Object.keys(this._QUESTS).forEach(key => {
        let value = this.get(key)
        if (filter_value === null) list.push(key)
        else if (value.keywords !== null && value.keywords !== undefined && value.keywords.toLowerCase().includes(filter_value.toLowerCase())) list.push(key)
        else if (value.description !== null && value.description !== undefined && value.description.toLowerCase().includes(filter_value.toLowerCase())) list.push(key)
        else if (value.title.toLowerCase().includes(filter_value.toLowerCase())) list.push(key)
      })
      if (list.length === 0) return undefined
      return list
    }
  
    get(label) {
      if (label === undefined) return this._QUESTS
      return this._QUESTS[label]
    }
  
    _add(quest) {
      this._QUESTS[quest.short_title] = quest
    }
  
    add(quest_txt) {
      if (quest_txt === null || quest_txt === undefined) return log({ error: "QuestMan>add", data: "no valid data" })
      var json = undefined
      try {
        json = JSON.parse(quest_txt)
      } catch (e) {
        log({ error: "QuestMan>add", data: e })
        return false
      }
  
      if (json.items === undefined || json.title === undefined || json.short_title === undefined) return log({ error: "QuestMan>add", data: "no valid data" })
      //   everything seems fine
      this._add(json)
      this._save()
      return true
    }
  
    remove_by_index(index) {
      if (index < 0 || index > this._QUESTS.length) return false
      const quest = this.quest_list[index]
      console.log('remove quest: ' + quest)
      Vue.delete(this._QUESTS, quest)
      this._save()
    }
  
    remove_by_name(name) {
      if (!this.quest_list.includes(name)) return false
      Vue.delete(this._QUESTS, name)
      this._save()
    }
  
    // ACTIVE QUEST
    set activeQuest(label) {
      if (!this.quest_list.includes(label) || label === undefined) this._activeQuest = undefined
      else this._activeQuest = {
        label: label,
        value: JSON.parse(JSON.stringify(this.get(label))),
        date_start: Date.now()
      }
    }
  
    get activeQuest() {
      return this._activeQuest
    }
  
    next() {
      this.activeQuest = this.next_preset
      if (this.activeQuest === undefined) return false
  
      return true
    }
  
    reset_activeQuest() {
      if (this.activeQuest === undefined) return false
      this._activeQuest.value = JSON.parse(JSON.stringify(this.get(this._activeQuest.label)))
      return true
    }
  
    check_activeQuest() { //returns true if all questions were answered correctly
      if (this.activeQuest === undefined) return undefined
  
      const index = []
  
      this.activeQuest.value.items.forEach(item => {
        if (item.force === false) index.push(true)
        else if (item.type === 'textbox' || item.type === 'seperator' || item.type === undefined) index.push(null)
        else if (item.type === 'multiple_radio') {
          if (item.value === undefined || item.value === null) index.push(false)
          else {
            let ISVALID = true
            item.value.forEach(val => {
              if (val === undefined || val === null) ISVALID = false
            })
            index.push(ISVALID)
          }
        }
        else if (item.value !== undefined && item.value !== null) index.push(true)
        else index.push(false)
      })
  
      if (index.includes(false)) return index
      else return true
    }
  
    // LIST OF MULTIPLE QUESTS TO PROCESS
    get presets() {
      return this._presets
    }
  
    set presets(value) {
      if (value === undefined) return
      if (!Array.isArray(value)) return this.add_preset(value)
      value.forEach(val => this.add_preset(val))
    }
  
    add_preset(val) {
      if (val === undefined) return
      if (this.quest_list.includes(val)) this._presets.push(val)
    }
  
    clear_preset() {
      this._presets = []
      this._activeQuest = undefined
    }
  
    get next_preset() {
      if (this._presets.length === 0) return undefined
      const result = this._presets[0]
      this._presets.shift()
      return result
    }
  
    // RESULTS
    get summary() {
      console.log('get summary')
      if (this.activeQuest === undefined) return undefined
  
      const result = {}
      result.label = this.activeQuest.value.short_title
      result.title = this.activeQuest.value.title
      result.items = [],
        // loop through items:
        this.activeQuest.value.items.forEach(item => {
  
          if (item.value !== undefined && item.value !== null) {
            if (item.type === 'number' && typeof (item.value) === 'string') item.value = parseFloat(item.value)
            else if (item.type === 'multiple_radio' && Array.isArray(item.value)) {
              for (let i = 0; i < item.value.length; i++) {
  
                let tmp_item = {
                  tag: undefined,
                  value: item.value[i],
                  coding: item.options.questions[i].coding
                }
                if (item.tag !== undefined) tmp_item.tag = `${item.tag}_${item.options.questions[i].tag}`
                else tmp_item.tag = item.options.questions[i].tag
  
                if (item.options.questions[i].id !== undefined) tmp_item.id = item.options.questions[i].id
                this.push_result(result, tmp_item, item.ignore_for_result)
              }
            } else this.push_result(result, item, item.ignore_for_result)
          }
        })
      // results
      result.results = calc_results(result, this.activeQuest.value.results)
      result.coding = this.activeQuest.value.coding
  
      // evaluation
      if (this.activeQuest.value.results !== undefined && this.activeQuest.value.results.evaluation !== undefined) result.results = this.evaluate(result.results, this.activeQuest.value.results.evaluation)
  
      // dates
      result.date_start = this.activeQuest.date_start
      result.date_end = Date.now()
      console.log('get summary: finished')
      return result
    }
  
    push_result(result, item, ignore_for_result) {
      let tmp = {
        label: item.tag,
        value: item.value,
        coding: item.coding
      }
      if (tmp.coding !== undefined) tmp.label = tmp.coding.display
      if (item.id !== undefined) tmp.id = item.id
      if (ignore_for_result !== undefined) tmp.ignore_for_result = item.ignore_for_result
      result.items.push(tmp)
    }
  
    evaluate(res, ev) {
      // console.log('evaluate', res, ev)
      // bisher nur sum umgesetzt
      const evaluation = []
      res.forEach(r => {
        if (r.label === 'sum') {
          let tmp = undefined
          ev.forEach(e => {
            if (e.range[0] <= r.value && e.range[1] >= r.value) tmp = e.label
          })
  
          if (tmp !== undefined) r.evaluation = tmp //add .evaluation to the field
        }
      })
  
      return res
    }
  
    // RANDOM FILL THE ACTIVE QUEST
    random_fill() {
      if (this.activeQuest === undefined) return undefined
  
      var complete = true
  
      // LOOP THROUGH THE QUEST
      this.activeQuest.value.items.forEach(item => {
        switch (item.type) {
          case 'checkbox':
            let rndValueCheck = []
            for (let i = 0; i < item.options.length - 1; i++) {
              if (RANDOM(1) === 1) rndValueCheck.push(item.options[i].value)
            }
            item.value = rndValueCheck
            break
          case 'radio':
            let rndNum = RANDOM(item.options.length - 1)
            let rndValue = item.options[rndNum].value
            item.value = rndValue
            break
  
          case 'multiple_radio':
            const val = []
            item.options.questions.forEach(quest => {
              let rndNum = RANDOM(item.options.answers.length - 1)
              val.push(item.options.answers[rndNum].value)
            })
            item.value = val
            break
  
          case 'number':
            item.value = RANDOM(100)
            break
  
          case 'slider':
            item.value = 0
            break
  
          case 'text':
            item.value = RANDOMWORD()
            break
  
          case undefined:
          case 'seperator':
          case 'separator':
          case 'textbox':
            // donothing
            break
  
          case 'date':
            item.value = '01.01.1970'
            break
  
          case 'date_year':
            item.value = '1970'
            break
  
          case 'time':
            item.value = '12:00'
            break
  
          default:
            console.info(`random fill: item type: ${item.type} not supported`)
            console.info(item)
            complete = false
            break
        }
      })
  
      return complete
    }
  
    //   SIMPLE CHECK
    check() {
      return true
    }
  }



// SOME FUNCTIONS
function RANDOM(max) {
  return Math.round(Math.random() * (max));
}

function RANDOMWORD() {
  const words = ['some', 'random', 'words']
  return words[RANDOM(words.length - 1)]
}

// CALC RESULTS
function calc_results(data, methods) {
  if (methods.method === undefined) return {}
  switch (methods.method) {
    case 'sum':
      return calc_simple_sum(data.items, methods)
      break

    case 'avg':
      return calc_simple_avg(data.items, methods)
      break

    case 'count':
      return calc_count(data.items, methods)
      break

    case 'count_targets':
      return calc_count_targets(data.items, methods)
      break

    case 'ids':
      return calc_ids(data.items, methods)
      break

    default:
      console.info(`calc_results: method ${methods.method} not supprted`)
      break
  }

  return {}
}

// CALC SUMS
function calc_simple_sum(items, methods) {
  var sum = 0
  items.forEach(item => {
    if (typeof item.value === 'number' && item.ignore_for_result !== true) {
      sum += item.value
    } //added 20231229: if array, then sum all values
    else if (Array.isArray(item.value) && item.ignore_for_result !== true) {
      item.value.forEach(val => {
        if (typeof val === 'number') sum += val
      })
    }
  })
  const RESULT = { 'label': 'sum', 'value': sum }
  if (methods.coding) RESULT.coding = methods.coding
  return [RESULT]
}

// CALC AVG
function calc_simple_avg(items, methods) {
  var sum = 0
  var count = 0
  items.forEach(item => {
    if (typeof item.value === 'number' && item.ignore_for_result !== true) {
      sum += item.value
      count++
    }
  })
  const RESULT = { 'label': 'avg', 'value': Math.round(100 * sum / count) / 100 }
  if (methods.coding) RESULT.coding = methods.coding
  return [RESULT]
}

// CALC COUNT

function calc_count(items, methods) {
  // ERZEUGE LISTE MIT ALLEN ANTWORTEN / VALUES
  const answers = [];
  items.forEach(item => {
    answers.push(item.value)
  })

  // console.log('calc_count => answers: ', answers)
  // ENTFERNE DOPPELUNGEN und bereite COUNT struktur vor
  const unique_answers = [...new Set(answers)] // neue ES6 Methode
  const count = {}
  unique_answers.forEach(answ => {
    count[answ] = {
      count: 0,
      label: answ,
    }
  })

  // LAUFE JETZT DURCH ALLE ANTWORTEN
  var total = 0
  items.forEach(item => {
    count[item.value].count++
    total++
  })

  // ERZEUGE RESULTS
  const results = []
  Object.keys(count).forEach(key => {
    results.push({
      label: count[key].label,
      value: count[key].count,
      total: total
    })
  })

  return results
}

// CALC_IDS
// CALC SUM IDS ~~~~ SEE SF36 SCORE for REFERENCE / IMPLEMENTATION
function calc_ids(items, method) {
  const results = []
  // FIRST collect IDs
  const VALUES = []
  items.forEach(item => {
    VALUES.push({ id: item.id, value: item.value })
    // getIDs(VALUES, item)
  })
  // console.log(VALUES)

  // NOW RESCORE according to method.scoring
  VALUES.forEach(val => {
    val.score = getScore(method.scoring, val)
  })
  // console.log('SCORING: ')
  // console.log(VALUES)

  // THEN FILL DOMAINS
  method.domaine.forEach(sub => {
    let val = {
      label: sub.label,
      value: 0
    }
    val.value = Math.round(getDomaineScore(VALUES, sub, results) * 100) / 100
    if (sub.coding) val.coding = sub.coding
    // console.log(val)
    // PUSH RESULT
    results.push(val)
  })

  // console.log(results)
  return results

  // SOME LOCAL FUNCTIONS: getScore und getDomainScore
  function getScore(scoring, val) {
    var score = 0
    scoring.forEach(s => {
      if (s.id.includes(val.id)) {
        if (Array.isArray(val.value)) { //added to support checkbox => array structure of values
          val.value.forEach(v => {
            let pos = s.value.indexOf(v)
            if (pos !== undefined) score += s.score[pos];
          })
        }
        else if (Array.isArray(s.value)) { // value[0,1,2] => score[10,20,30] ,ie. sf36
          let pos = s.value.indexOf(val.value)
          if (pos !== undefined) score = s.score[pos];
        }

        else if (s.method !== undefined && s.method === 'raw') score = val.value
        else if (s.method !== undefined && s.method === 'multiply') score = val.value * s.value // v.value * s.value >> i.e. paq50plus
        else if (s.method !== undefined && s.method === 'range') score = calc_range(val.value, s.range) // v.value * s.value >> i.e. paq50plus
        else if (s.method !== undefined && s.method === 'count') score = val.value.length
      }
    })
    return score
  }

  function calc_range(val, range) {
    var out = undefined
    if (val === undefined || range === undefined) return undefined
    range.forEach(r => {
      if (r.value[0] <= val && r.value[1] >= val) out = r.score
    })
    return out
  }

  function getDomaineScore(VALUES, sub, RESULTS) {
    var score = 0
    var count_zeros = 0 //added 16.06.2021 >> wenn methode.ignore_zerose === 0, dann soll beim Averagen dieser Wert nicht berücksichtigt werden
    // loop through sub.id
    sub.id.forEach(id => {
      if (typeof id === 'number') {
        let el = VALUES.find(v => v.id === id)
        if (el !== undefined && (sub.method === 'sum' || sub.method === 'sum_range' || sub.method === 'avg' || sub.method === 'avg_multiply' || sub.method === 'sum_multiply' || sub.method === 'sum_sub_multiply')) {
          score += el.score
          count_zeros += (el.score === 0)
        }
        else if (el !== undefined && sub.method === 'multiply') {
          if (score === 0) score = el.score
          else score = score * el.score
        } else if (el !== undefined && sub.method === 'diff_range') {
          if (score === 0) score = el.score
          else score = substract(score, el.score)
        }
      } else if (typeof id === 'string') {
        // search in results
        let el = RESULTS.find(v => v.label === id)
        // console.log(el)
        if (el !== undefined && (sub.method === 'sum' || sub.method === 'sum_range' || sub.method === 'avg' || sub.method === 'sum_multiply' || sub.method === 'sum_sub_multiply')) score += el.value;
        else if (el !== undefined && sub.method === 'multiply') {
          if (score === 0) score = el.value
          else score = score * el.value
        }
      }
    })

    // some additional calculations
    if (sub.method === 'sum_multiply') { //ie quest_sus.json
      if (sub.value) score = score * sub.value
    }
    if (sub.method === 'avg' || sub.method === 'avg_multiply') {
      if (sub.ignore_zeros === true) score = score / (sub.id.length - count_zeros) //added 1606.2021: 0 wird nicht als Wert gezählt und abgezogen ...
      else score = score / sub.id.length
      if (sub.method === 'avg_multiply') score = score * sub.value
    }
    if (sub.method === 'sum_range' || sub.method === 'diff_range') score = calc_range(score, sub.sum_range)
    if (sub.method === 'sum_sub_multiply') score = (score - sub.value[0]) * sub.value[1]

    // DEBUG
    // console.log(sub.label, sub.value, score)
    return score
  }

  function substract(a, b) {
    if (typeof a === 'number' && typeof b === 'number') return a - b
    // gehen wir erstmal von Zeit aus
    if (typeof a === 'string' && typeof b === 'string') {
      const time1 = '1.1.1970 ' + a
      const time2 = '2.1.1970 ' + b
      //  mach ich mal irgendwann ...
    }
    return `${a}-${b}`
  }
}

// COUNT TARGETS
function calc_count_targets(items, method) {
  const result = []
  method.targets.forEach(target => {
    let res = {
      label: target.label,
      value: 0,
      total: 0
    }
    // loop through items and look for the target ...
    items.forEach(item => {
      if (item.value === target.value) {
        res.value += target.score
        res.total += target.score
      }
    })

    result.push(res)
  })

  return result
}
