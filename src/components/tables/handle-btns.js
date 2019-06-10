const btns = {
  delete: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        title: '你确定要删除吗?'
      },
      on: {
        'on-ok': () => {
          console.log(params)
          vm.$emit('on-delete', params)
          vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        }
      }
    }, [
      h('Button', [
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
