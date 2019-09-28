<template>
  <div class="row justify-content-center">
        <div class="loader" v-show="loading">
          <span class="spinner spinner-grow"></span>
      </div>
      <div class="col-md-8">
          <div class="card card-default">
              <div class="card-header">TTS</div>
              <div class="card-body">
                  <div class="form-group">
                      <label>Choisir une voix</label>
                  <select class="form-control" v-model="selectedVoice" @change="getVoiceDetail()">
                      <option></option>
                      <option v-for="voice in voices">{{voice.name}}</option>
                  </select>
                  </div>
                  
                  <div v-if="selectedVoice!=''">
                      <p>Voix : {{voiceDetails.name}}</p>
                      <p>Langue : {{voiceDetails.language}}</p>
                      <p>Gender : {{voiceDetails.gender}}</p>
                      <p>Customizable : {{voiceDetails.customizable==true? 'oui':'non'}}</p>
                      <p>Description : {{voiceDetails.description}}</p>
                  </div>
                  <div>
                      <div class="form-group">
                        <textarea v-model="text" style="width:100%"></textarea>  
                      </div>
                    <button class="btn btn-success" @click="synthesize()">Go</button>
                  </div>
              </div>
              <div>
                   <audio ref="player" controls autoplay >
                        <source :src="audio" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
              </div>

          </div>
      </div>
  </div>
</template>

<script>

  export default {
      data (){
          return {
            loading : false,
            voices : [],
            selectedVoice : '',
            voiceDetails : {},
            text : '',
            audio : ''
          }
      },
      methods:{
          getListVoices: async function(){
              this.loading = true
              let res = await fetch('http://localhost:8088/getvoices')
              .then(resp => resp.json())
              .then(data => {
                  this.voices = data.voices
                  this.loading = false
              })
              .catch(err => {
                  console.log(err)
                  this.loading = false
                  })

          },
           getVoiceDetail: async function(){
               this.loading = true
               console.log(this.selectedVoice)
               if (this.selectedVoice!=""){
                    let res = await fetch('http://localhost:8088/getvoicedetails/'+ this.selectedVoice)
                    .then(resp => resp.json())
                    .then(data => {
                        this.voiceDetails = data
                        this.loading = false
                    })
                    .catch(err => {
                        console.log(err)
                        this.loading = false
                        })
               }
          },
          synthesize: async function(){
              
              if (this.text!=""){
                  this.loading = true
                  console.log(this.text)
                    let res = await fetch('http://localhost:8088/synthesize',{
                        method : 'post',
                        body : JSON.stringify( {
                            text : this.text,
                            name : this.selectedVoice
                        }),
                        headers : {
                        'Content-type' : 'Application/json',
                        }
                    })
                    .then(resp => resp.json())
                    .then(data => {
                        this.audio = 'http://localhost:8088/waves/'+data.filename
                        this.$refs.player.load()
                        this.loading = false
                        console.log('success')
                    })
                    .catch(err => {

                            console.log(err)
                            this.loading = false

                        this.loading = false
                        })
               }
          }
      },
      mounted(){
            this.getListVoices()
      }
  }
</script>