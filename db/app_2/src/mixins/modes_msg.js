
export default {
  data() {
    return {
      
    }
  },

    computed: {
        
    },

    methods: {
      _error_msg(msg) {
        this.$q.notify({
          message: msg,
          color: 'negative',
          timeout: 2000
        })
        return false
      },

      _success_msg(msg) {
        this.$q.notify({
          message: msg,
          color: 'positive',
          timeout: 2000
        })
        return true
      },


    }

}