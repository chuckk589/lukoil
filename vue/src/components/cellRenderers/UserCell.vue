<template>
  <div>
    <v-btn
      density="compact"
      class="ma-2"
      variant="text"
      icon="mdi-pencil"
      @click="edit"
    ></v-btn>
  </div>
</template>

<script>
export default {
  name: 'UserCell',
  data() {
    return {};
  },
  methods: {
    edit() {
      this.$emitter.emit('openModal', {
        url: `/user/${this.params.data.id}`,
        method: 'PUT',
        header: 'Редактировать',
        eventName: 'edit-user',
        fields: [
          // {
          //   key: 'credentials',
          //   label: 'Имя',
          //   value: this.params.data.credentials,
          // },
          {
            key: 'locale',
            label: 'Язык',
            type: 'select',
            value: this.params.data.locale,
            options: this.$ctable.locales,
          },
          {
            key: 'phone',
            label: 'Номер',
            value: this.params.data.phone,
          },
          // {
          //   key: 'promo',
          //   label: 'Промо',
          //   type: 'select',
          //   value: this.params.data.promo,
          //   options: this.$ctable.promotions,
          // },
          {
            key: 'role',
            label: 'Роль',
            type: 'select',
            value: this.params.data.role,
            options: this.$ctable.roles,
          },
          {
            label: 'Заблокирован',
            key: 'isBlocked',
            hint: 'Заблокированные пользователи не принимают участия в акциях',
            type: 'select',
            value: this.params.data.isBlocked,
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
