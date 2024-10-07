<template>
  <AgGridVue
    class="ag-theme-alpine"
    :column-defs="columnDefs"
    :default-col-def="defaultColDef"
    animateRows
    suppressCellFocus
    :get-row-id="getRowId"
    :row-data="rowData"
    rowSelection="multiple"
    suppressRowClickSelection
    pagination
    style="height: 100%"
    @grid-ready="onGridReady"
    suppressExcelExport
    :defaultCsvExportParams="defaultCsvExportParams"
  >
  </AgGridVue>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import UserCell from '../components/cellRenderers/UserCell.vue';
export default {
  name: 'UsersView',
  components: {
    AgGridVue,
    // eslint-disable-next-line vue/no-unused-components
    UserCell,
  },
  data() {
    return {
      columnDefs: [
        {
          headerName: 'ID',
          field: 'id',
        },
        { field: 'chatId', headerName: 'Telegram Id' },

        { field: 'credentials', headerName: 'Имя' },
        {
          field: 'locale',
          headerName: 'Язык',
          valueFormatter: (params) =>
            this.$ctable.locales.find((c) => c.value == params.value)?.title,
          sortable: true,
        },
        { field: 'phone', headerName: 'Номер' },
        {
          field: 'promo',
          headerName: 'Промо',
          valueFormatter: (params) =>
            this.$ctable.promotions.find((c) => c.value == params.value)?.title,
          sortable: true,
        },
        {
          field: 'city',
          headerName: 'Город',
          valueFormatter: (params) =>
            this.$ctable.cities.find((c) => c.value == params.value)?.title,
          sortable: true,
        },
        {
          field: 'role',
          headerName: 'Роль',
          valueFormatter: (params) =>
            this.$ctable.roles.find((c) => c.value == params.value)?.title,
          sortable: true,
        },
        {
          field: 'registered',
          headerName: 'Регистрация пройдена',
          valueFormatter: (params) => (params.value ? 'Да' : 'Нет'),
          sortable: true,
        },

        { field: 'createdAt', headerName: 'Дата регистрации', sortable: true },
        {
          field: 'action',
          headerName: '',
          cellRenderer: 'UserCell',
        },
      ],
      defaultCsvExportParams: null,
      gridApi: null,
      defaultColDef: {
        sortable: true,
        flex: 1,
      },
      getRowId: function (params) {
        return params.data.id;
      },
      rowData: [],
    };
  },
  beforeUnmount() {
    this.$emitter.off('edit-user');
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.$http({ method: 'GET', url: `/v1/user/` }).then((res) => {
        this.rowData = res.data;
        this.gridApi.setRowData(this.rowData);
      });
      this.$emitter.on('edit-user', (evt) => {
        console.log(this.$emitter);
        const rowNode = this.gridApi.getRowNode(evt.id);
        rowNode.setData(evt);
      });
      this.defaultCsvExportParams = {
        columnKeys: this.columnDefs
          .filter((c) => c.headerName)
          .map((c) => c.field),
        processCellCallback: (params) => {
          const colDef = params.column.getColDef();
          if (colDef.valueFormatter) {
            const valueFormatterParams = {
              ...params,
              data: params.node.data,
              node: params.node,
              colDef: params.column.getColDef(),
            };
            return colDef.valueFormatter(valueFormatterParams);
          }
          return params.value;
        },
      };
    },
  },
};
</script>
