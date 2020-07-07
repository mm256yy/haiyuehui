Component({
  behaviors: [],
  properties: { 
    labelText: {
      type: String,
      value: '',
    }
  },
  data: { 
    value:""
  },
  methods: {   
    bindInput:function(e){
      this.triggerEvent('input',e.detail.value)
    }
  }
})
