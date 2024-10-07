<template>
  <AgGridVue
    class="ag-theme-alpine"
    :column-defs="columnDefs"
    :default-col-def="defaultColDef"
    suppressCellFocus
    :get-row-id="getRowId"
    :row-data="rowData"
    animateRows
    style="height: 100%"
    @grid-ready="onGridReady"
    suppressRowClickSelection
    suppressExcelExport
    pagination
    :defaultCsvExportParams="defaultCsvExportParams"
  >
  </AgGridVue>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import CheckCell from '../components/cellRenderers/CheckCell.vue';
export default {
  name: 'ChecksView',
  components: {
    AgGridVue,
    // eslint-disable-next-line vue/no-unused-components
    CheckCell,
  },
  data() {
    return {
      columnDefs: [
        {
          headerName: 'ID',
          field: 'id',
        },
        { field: 'fancyId', headerName: 'Id чека' },

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
          field: 'status',
          headerName: 'Статус чека',
          valueFormatter: (params) =>
            this.$ctable.check_statuses.find((c) => c.value == params.value)
              ?.title,
          sortable: true,
        },

        {
          field: 'createdAt',
          headerName: 'Дата регистрации',
          sortable: true,
          valueFormatter: (params) => new Date(params.value).toLocaleString(),
        },
        {
          field: 'action',
          headerName: '',
          cellRenderer: 'CheckCell',
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
    this.$emitter.off('view-check');
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.$http({ method: 'GET', url: `/v1/check/` }).then((res) => {
        this.rowData = res.data;
        this.gridApi.setRowData(this.rowData);
      });
      this.$emitter.on('view-check', (evt) => {
        const index = this.rowData.findIndex((c) => c.id == evt.id);
        this.rowData[index] = evt;
        this.gridApi.applyTransaction({ update: [evt] });
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
