<template>
  <div class="cropper-wrapper">
    <slot>
      <Upload action="image/upload" :before-upload="beforeUpload"  style="margin-bottom: 22px">
        <Button style="width: 150px;" type="primary">选择文件</Button>
      </Upload>
    </slot>
    <div class="img-box">
      <img class="cropper-image" :id="imgId" alt="">
    </div>
    <div class="right-con">
      <p style="color: #515A6E; margin-bottom: 30px; font-size: 15px">头像预览</p>
      <div v-if="preview" class="preview-box" :id="previewId"></div>
      <p style="margin-top: 10px; margin-bottom: 30px; font-size: 15px; color: #9AA7BC">大头像 100*100</p>
      <div v-if="preview" class="preview-box2" :id="previewId"></div>
      <p style="margin-top: 10px; font-size: 15px; color: #9AA7BC">小头像 50*50</p>
      <!--<div class="button-box">-->
        <!--<div v-show="insideSrc">-->
          <!--<Button type="primary" @click="rotate">-->
            <!--<Icon type="md-refresh" :size="18"/>-->
          <!--</Button>-->
          <!--<Button type="primary" @click="shrink">-->
            <!--<Icon type="md-remove" :size="18"/>-->
          <!--</Button>-->
          <!--<Button type="primary" @click="magnify">-->
            <!--<Icon type="md-add" :size="18"/>-->
          <!--</Button>-->
          <!--<Button type="primary" @click="scale('X')">-->
            <!--<Icon custom="iconfont icon-shuipingfanzhuan" :size="18"/>-->
          <!--</Button>-->
          <!--<Button type="primary" @click="scale('Y')">-->
            <!--<Icon custom="iconfont icon-chuizhifanzhuan" :size="18"/>-->
          <!--</Button>-->
          <!--<Button type="primary" @click="move(0, -moveStep)">-->
            <!--<Icon type="md-arrow-round-up" :size="18"/>-->
          <!--</Button>-->
          <!--<Button type="primary" @click="move(-moveStep, 0)">-->
            <!--<Icon type="md-arrow-round-back" :size="18"/>-->
          <!--</Button>-->
          <!--<Button type="primary" @click="move(0, moveStep)">-->
            <!--<Icon type="md-arrow-round-down" :size="18"/>-->
          <!--</Button>-->
          <!--<Button type="primary" @click="move(moveStep, 0)">-->
            <!--<Icon type="md-arrow-round-forward" :size="18"/>-->
          <!--</Button>-->
          <!--<Button style="width: 150px;margin-top: 10px;" type="primary" @click="crop">{{ cropButtonText }}</Button>-->
        <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import './index.less'
import 'cropperjs/dist/cropper.min.css'
export default {
  name: 'Cropper',
  props: {
    src: {
      type: String,
      default: ''
    },
    preview: {
      type: Boolean,
      default: true
    },
    moveStep: {
      type: Number,
      default: 4
    },
    cropButtonText: {
      type: String,
      default: '裁剪'
    }
  },
  data () {
    return {
      cropper: null,
      insideSrc: ''
    }
  },
  computed: {
    imgId () {
      return `cropper${this._uid}`
    },
    previewId () {
      return `cropper_preview${this._uid}`
    }
  },
  watch: {
    src (src) {
      this.replace(src)
    },
    insideSrc (src) {
      this.replace(src)
    }
  },
  methods: {
    beforeUpload (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        this.insideSrc = event.srcElement.result
      }
      return false
    },
    replace (src) {
      this.cropper.replace(src)
      this.insideSrc = src
    },
    rotate () {
      this.cropper.rotate(90)
    },
    shrink () {
      this.cropper.zoom(-0.1)
    },
    magnify () {
      this.cropper.zoom(0.1)
    },
    scale (d) {
      this.cropper[`scale${d}`](-this.cropper.getData()[`scale${d}`])
    },
    move (...argu) {
      this.cropper.move(...argu)
    },
    crop () {
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.$emit('on-crop', blob)
      })
      // let file = this.cropper.getCroppedCanvas().toDataURL('image/png')
      // this.$emit('on-crop', file)
    }
  },
  mounted () {
    this.$nextTick(() => {
      let dom = document.getElementById(this.imgId)
      this.cropper = new Cropper(dom, {
        preview: `#${this.previewId}`,
        checkCrossOrigin: true
      })
    })
  }
}
</script>
