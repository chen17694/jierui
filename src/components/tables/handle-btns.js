const btns = {
  delete: (h, params, vm) => {
    return h('span', [
      h('Button', {
        on: {
          click: () => {
            vm.$emit('on-delete', params)
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-trash',
            size: 14,
            color: '#000000'
          }
        })
      ])
    ])
  },
  edit: (h, params, vm) => {
    return h('span', [
      h('Button', {
        on: {
          click: () => {
            vm.$emit('on-edit', params)
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-settings',
            size: 14,
            color: '#000000'
          }
        })
      ])
    ])
  },
  roles: (h, params, vm) => {
    return h('span', { 'style': { marginLeft: '10px' } }, [
      h('Button', {
        on: {
          click: () => {
            vm.$emit('on-roles', params)
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-list',
            size: 14,
            color: '#000000'
          }
        })
      ])
    ])
  },
  add: (h, params, vm) => {
    return h('span', { 'style': { marginRight: '10px' } }, [
      h('Button', {
        on: {
          click: () => {
            vm.$emit('on-add', params)
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-add',
            size: 14,
            color: '#000000'
          }
        })
      ])
    ])
  },
  remove: (h, params, vm) => {
    return h('span', {
      on: {
        click: () => {
          vm.$emit('on-remove', params)
        }
      }
    }, [
      h('Button', [
        h('Icon', {
          props: {
            type: 'md-close',
            size: 14,
            color: '#000000'
          }
        })
      ])
    ])
  },
  back: (h, params, vm) => {
    return h('span', [
      h('Button', {
        on: {
          click: () => {
            vm.$emit('on-back', params)
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-alarm',
            size: 14,
            color: '#000000'
          }
        })
      ])
    ])
  },
  urge: (h, params, vm) => {
    return h('span', [
      h('Button', {
        on: {
          click: () => {
            vm.$emit('on-urge', params)
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-alarm',
            size: 14,
            color: '#000000'
          }
        })
      ])
    ])
  }
}

export default btns
