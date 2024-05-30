<template>
    <div class="column my-column">
      <div v-if="SHOW_SPINNER" class="absolute-top-right q-mr-md">
        <q-spinner color="primary" size="4em"/>
        lade ...

      </div>
        <q-resize-observer @resize="onResize" />

        <!-- HEADING -->
        <div class="col-2 bg-accent" >

            <div class="row justify-center" >
            <slot name="header">
                <!-- text hier -->
            </slot>
        </div>
    </div>
        <!-- OPTIONS -->
        <div class="col-1 bg-grey-1" v-if="no_options !== true">

            <div class="row" >
                <div class="col-6 text-left">
                    <slot name="options_left">
                        <!-- TEXT -->
                    </slot>
                </div>
                <div class="col-6 text-right">
                    <slot name="options_right">
                        <!-- TEXT -->
                    </slot>
                </div>
            </div>
        </div>

        <!-- MAIN -->
        <div class="col-8 bg-grey-1" :class="COL_MAIN">
            <q-scroll-area style="height: 100%; width: 100%">
                <div class="row justify-center">
                    <slot name="main">
                        <!-- TEXT hier -->
                    </slot>
                </div>
            </q-scroll-area>
        </div>
        <!-- BUTTONS -->
        <div v-if="no_footer !== true" class="col-1 bg-accent flex flex-center">
            <slot name="footer">
                <!-- text hier -->
            </slot>
        </div>


    </div>
</template>

<script>

export default {
    name: 'MainSlot',

    props: ["no_options", "no_footer"],

    computed: {
        COL_MAIN() {
            if (this.no_options === true && this.no_footer === true) return 'col-10'
            else if (this.no_options === true || this.no_footer === true) return 'col-9'
            return 'col-8'
        },

        SHOW_SPINNER() {
            return this.$store.getters.SHOW_SPINNER
        }
    },

    methods: {
        // methods hier
        onResize(size) {
            this.$emit('resize', size)
        }
    }
}

</script>
