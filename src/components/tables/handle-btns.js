const btns = {
  delete: (h, params, vm) => {
    return h('span', [
      h('Button', [
        h('Icon', {
          props: {
            type: 'md-trash',
            size: 14,
            color: '#000000'
          },
          on: {
            click: () => {
              vm.$emit('on-delete', params)
            }
          }
        })
      ])
    ])
  },
  edit: (h, params, vm) => {
    return h('span', [
      h('Button', [
        h('Icon', {
          props: {
            type: 'md-settings',
            size: 14,
            color: '#000000'
          },
          on: {
            click: () => {
              vm.$emit('on-edit', params)
            }
          }
        })
      ])
    ])
  },
  roles: (h, params, vm) => {
    return h('span', { 'style': { marginLeft: '10px' } }, [
      h('Button', [
        h('Icon', {
          props: {
            type: 'md-list',
            size: 14,
            color: '#000000'
          },
          on: {
            click: () => {
              vm.$emit('on-roles', params)
            }
          }
        })
      ])
    ])
  }
}

export default btns
