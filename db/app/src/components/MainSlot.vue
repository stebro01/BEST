<template>
    <div class="column my-column">
        <!-- HEADING -->
        <div class="col-2 bg-accent">
            <div class="row justify-center">
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
        <div class="col-8 bg-grey-1" :class="{'col-9': no_options === true}">
            <q-scroll-area style="height: 100%; width: 100%">
                <div class="row justify-center">
                    <slot name="main">
                        <!-- TEXT hier -->
                    </slot>
                </div>
            </q-scroll-area>
        </div>
        <!-- BUTTONS -->
        <div class="col-1 bg-accent">
            <slot name="footer">
                <!-- text hier -->
            </slot>
        </div>
    </div>
</template>

<script>

export default {
  name: 'MainSlot',

    props: ["no_options"]
}

</script>