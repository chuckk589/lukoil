<template>
  <div>
    <v-btn
      density="compact"
      class="ma-2"
      variant="text"
      icon="mdi-image-area"
      @click="view"
    ></v-btn>
  </div>
</template>

<script>
export default {
  name: 'CheckCell',
  data() {
    return {};
  },
  methods: {
    view() {
      this.$emitter.emit('openModal', {
        url: `/check/${this.params.data.id}`,
        method: 'PUT',
        header: 'Просмотр чека',
        eventName: 'view-check',
        fields: [
          {
            type: 'img',
            value: `${this.params.data.checkPath}`,
            // value: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg',
          },
          {
            key: 'status',
            label: 'Статус',
            type: 'select',
            value: this.params.data.status,
            options: this.$ctable.check_statuses,
          },
        ],
      });
    },
  },
};
</script>
