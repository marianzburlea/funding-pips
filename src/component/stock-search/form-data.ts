import type { TJSONForm } from '@wowjob/ui'

export const fromStructure: TJSONForm['formStructure'] = {
  data: {
    search: {
      type: 'search',
      label: 'Search term',
      name: 'search',
      placeholder: 'apple',
      help: 'Type a search stock name',
    },
  },
  list: ['search'],
  form: {
    footer: {
      data: {
        search: {
          name: 'action',
          label: 'Search',
          type: 'submit',
          theme: 'primary',
        },
      },
      list: ['search'],
    },
    name: 'search-stock-form',
    header: {
      title: 'Search stocks',
    },
  },
}
