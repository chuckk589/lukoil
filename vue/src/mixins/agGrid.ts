import { useAgGridStore } from '@/stores/aggrid';
export const agGridMixin = {
  computed: {
    store: () => useAgGridStore(),
  },

  methods: {
    cTableFormatter(key: string) {
      return (params: any) =>
        (this as any).$ctable[key].find(
          (c: { id?: number; name: string; description: string }) =>
            c.name == params.value || c.id == params.value,
        )?.description;
    },
    dateComparator(filterLocalDateAtMidnight: Date, cellValue: string) {
      const cellDate = new Date(cellValue);
      cellDate.setHours(0, 0, 0, 0);
      if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
    },
    numberComparator(filterNumber: number, cellValue: number) {
      return cellValue - filterNumber;
    },
    agGridExportParams(): any {
      return {
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
