<template>
    <div>
      <Select v-model="pId" placeholder="请选择省份" style="margin-bottom: 10px">
        <Option v-for="item in provinceData" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <Select v-model="cId" placeholder="请选择城市" style="margin-bottom: 10px">
        <Option v-for="item in cityData" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <Select v-model="dId" placeholder="请选择区县" style="margin-bottom: 10px">
        <Option v-for="item in districtData" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </div>
</template>

<script>
export default {
  name: 'area_select',
  props: {
    name: {
      type: String,
      default () {
        return ''
      }
    },
    provinceId: {
      type: String,
      default () {
        return ''
      }
    },
    cityId: {
      type: String,
      default () {
        return ''
      }
    },
    districtId: {
      type: String,
      default () {
        return ''
      }
    },
    province: {
      type: Array,
      default () {
        return []
      }
    },
    city: {
      type: Array,
      default () {
        return []
      }
    },
    district: {
      type: Array,
      default () {
        return []
      }
    },
    getProvince: {
      type: Function,
      default () {
        return null
      }
    },
    getCity: {
      type: Function,
      default () {
        return null
      }
    },
    getDistrict: {
      type: Function,
      default () {
        return null
      }
    },
    obj: {
      type: Object,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      provinceData: this.province,
      cityData: this.city,
      districtData: this.district,
      pId: this.provinceId,
      cId: this.cityId,
      dId: this.districtId,
      areaName: this.name
    }
  },
  watch: {
    provinceId (val) {
      this.pId = val
    },
    cityId (val) {
      this.cId = val
    },
    districtId (val) {
      this.dId = val
    },
    province (val) {
      this.provinceData = val
    },
    city (val) {
      this.cityData = val
    },
    district (val) {
      this.districtData = val
    },
    name (val) {
      this.areaName = val
    },
    pId (val) {
      this.cId = ''
      this.dId = ''
      this.pId = val
      this.postId(this.pId, this.areaName, 1)
      this.getCity(val, this.obj)
    },
    cId (val) {
      this.dId = ''
      this.cId = val
      this.postId(this.cId, this.areaName, 2)
      this.getDistrict(val, this.obj)
    },
    dId (val) {
      this.dId = val
      this.postId(this.dId, this.areaName, 3)
    }
  },
  methods: {
    postId (val, name, type) {
      this.$emit('getId', val, name, type)
    }
  }
}
</script>

<style scoped>

</style>
