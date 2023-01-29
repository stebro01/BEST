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
        <!-- MAIN -->
        <div class="col-9 bg-grey-1">
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