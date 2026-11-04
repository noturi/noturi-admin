import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  type ReactTable,
  type RowData,
} from '@tanstack/react-table';

/**
 * 어드민 데이터 테이블이 쓰는 기능 (TanStack Table v9)
 * v9는 쓰는 기능만 등록해 번들을 줄이고, 타입 첫 자리(TFeatures)에 이 목록이 들어간다.
 * 새 기능(예: 행 확장)이 필요하면 여기에 추가 — 등록하지 않은 기능의 API(column.getCanSort 등)는 타입에서 사라진다.
 */
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  columnOrderingFeature, // 고정 열 경계(getIsFirstColumn/getIsLastColumn)
  columnPinningFeature,
  columnSizingFeature, // 고정 열 위치(getStart/getAfter)·너비 계산
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  filterFns,
  sortFns,
});

export type DataTableFeatures = typeof dataTableFeatures;

/** useDataTable이 돌려주는 테이블 — React 쪽 타입이라 table.state(현재 상태)를 읽을 수 있음 */
export type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>;
