import { Platform } from 'quasar'

export default {
    computed: {
        pageSize() {
            if (Platform.is.desktop) return 'height: calc(100vh - 50px); width: 100%'
            if (Platform.is.ios) return 'height: calc(100vh - 100px); width: 100%'
            if (Platform.is.mobile) return 'height: calc(100vh - 70px); width: 100%'
            return 'height: calc(100vh - 70px); width: 100%'
        }
    }
}