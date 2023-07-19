<script lang="ts" setup>
export interface Props {
  admin?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  admin: false,
});
const prefix = props.admin ? "/admin" : "/user";
</script>

<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="6" offset="3">
        <v-card color="primary" variant="outlined" title="Session Timeout">
          <v-card-text class="pa-2">
            <v-alert class="mb-0 text-body-1" dense type="warning">
              You have not logged in or there has been no operation for a
              certain period of time.
            </v-alert>
          </v-card-text>
          <v-card-actions class="pa-2">
            <UiBtn block variant="outlined" :to="prefix + '/login'">
              to Login
            </UiBtn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
