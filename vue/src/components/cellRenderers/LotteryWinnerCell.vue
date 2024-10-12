<template>
  <div>
    <!-- <v-btn
      density="compact"
      class="ma-2"
      variant="text"
      icon="mdi-image-area"
      @click="view"
    ></v-btn> -->
    <v-btn
      density="compact"
      class="ma-2"
      variant="text"
      icon="mdi-pencil"
      @click="edit"
    ></v-btn>
    <v-btn
      density="compact"
      class="ma-2"
      variant="text"
      color="error"
      icon="mdi-delete"
      @click="deleteWinner"
    ></v-btn>
  </div>
</template>

<script>
export default {
  name: 'LotteryWinnerCell',
  data() {
    return {};
  },
  methods: {
    deleteWinner() {
      this.$emitter.emit('openDialog', {
        header: 'Удалить победителя',
        message: 'Вы уверены, что хотите удалить победителя?',
        eventName: 'delete-winner',
        url: `/winner/${this.params.data.id}`,
        id: this.params.data.id,
      });
    },
    edit() {
      this.$emitter.emit('openModal', {
        url: `/winner/${this.params.data.id}`,
        method: 'PUT',
        header: 'Редактировать победителя',
        eventName: 'edit-winner',
        fields: [
          {
            label: 'Основной',
            key: 'primary',
            type: 'select',
            value: this.params.data.primary,
            options: [
              {
                name: true,
                description: 'Да',
              },
              {
                name: false,
                description: 'Нет',
              },
            ],
          },
          {
            label: 'Уведомлен',
            key: 'notified',
            type: 'select',
            hint: 'При уведомлении будет отправлено сообщение о выигрыше',
            value: this.params.data.notified,
            options: [
              {
                name: true,
                description: 'Да',
              },
              {
                name: false,
                description: 'Нет',
              },
            ],
          },
          {
            label: 'Подтвержден',
            key: 'confirmed',
            hint: 'Подтвержденный победитель будет отображаться в списке победителей (если розыгрыш уже завершен)',
            type: 'select',
            value: this.params.data.confirmed,
            options: [
              {
                name: true,
                description: 'Да',
              },
              {
                name: false,
                description: 'Нет',
              },
            ],
          },
        ],
      });
    },
  },
};
</script>
