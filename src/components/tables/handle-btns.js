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
  },
  add: (h, params, vm) => {
    return h('span', { 'style': { marginRight: '10px' } }, [
      h('Button', [
        h('Icon', {
          props: {
            type: 'md-add',
            size: 14,
            color: '#000000'
          },
          on: {
            click: () => {
              vm.$emit('on-add', params)
            }
          }
        })
      ])
    ])
  },
  remove: (h, params, vm) => {
    return h('span', [
      h('Button', [
        h('Icon', {
          props: {
            type: 'md-close',
            size: 14,
            color: '#000000'
          },
          on: {
            click: () => {
              vm.$emit('on-remove', params)
            }
          }
        })
      ])
    ])
  },
  back: (h, params, vm) => {
    return h('span', [
      h('Button', [
        h('Icon', {
          props: {
            type: 'md-alarm',
            size: 14,
            color: '#000000'
          },
          on: {
            click: () => {
              vm.$emit('on-back', params)
            }
          }
        })
      ])
    ])
  },
  urge: (h, params, vm) => {
    return h('span', [
      h('Button', [
        h('Icon', {
          props: {
            type: 'md-alarm',
            size: 14,
            color: '#000000'
          },
          on: {
            click: () => {
              vm.$emit('on-urge', params)
            }
          }
        })
      ])
    ])
  }
}

export default btns
