<template>
        <div class="row">
            <section>
            <h2>Transcribe from Microphone via Webpack bundle</h2>
            <button @click="stream">Start Microphone Transcription</button>

            <h2>Output:</h2>
            <div id="output">{{output}}</div>
            </section>
            <div class="col-sm-6">
                <audio-recorder
                    upload-url="http://localhost:8088/stt"
                    :attempts="3"
                    :time="20"
                    filename="ninja"
                    format="mp3" 

                    :before-recording="callback"
                    :pause-recording="callback"
                    :after-recording="callback"
                    :select-record="callback"
                    :before-upload="callback"
                    :successful-upload="callback"
                    :failed-upload="callback"/>

                  
            </div>
            <div class="col-sm-6">
              <div v-if="visible">
                  <label>Resultat : </label>
                  <p  class="resultat" v-for="res in alternatives.alternatives">
                      {{res.transcript}} <span class="confidence">({{res.confidence}})</span>,
                  </p>  
              </div>
                  <div v-if="result.length>0"> 
                      Traduction :
                      <p class="traduction" v-for="res in result">
                          {{res.translation}}
                      </p>
                  </div>
            </div>
          <div class="container nlu">
              {{nlu.body}} 
              <div>
              <label class="label">Catégories</label>
              <p v-for="cat in nlu.categories">
                {{cat.label}} <span class="badge badge-info">{{cat.score}}</span>
              </p>

              </div>
            <div>
              <label class="label">Concepts</label>
                <p v-for="cat in nlu.concepts">
                    {{cat.text}} <span class="badge badge-info">{{cat.relevance}} </span>
                </p>
              </div>
      
              <div class="emotion">
              <label class="label">Emotion</label>
                    <div v-if="nlu.emotion">
                        




                        <div class="progress">
                            <div class="progress-bar" :style="'width:'+ nlu.emotion.document.emotion.sadness*100 +'%'">
                                sadness ({{nlu.emotion.document.emotion.sadness}})
                            </div>
                            </div>

                            <!-- Green -->
                            <div class="progress">
                            <div class="progress-bar bg-success" :style="'width:'+ nlu.emotion.document.emotion.joy*100 +'%'">
                                Joy  ({{nlu.emotion.document.emotion.joy}})
                            </div>
                            </div>

                            <!-- Turquoise -->
                            <div class="progress">
                            <div class="progress-bar bg-info" :style="'width:'+ nlu.emotion.document.emotion.fear*100 +'%'">
                                Fear ({{nlu.emotion.document.emotion.joy}})
                            </div>
                            </div>

                            <!-- Orange -->
                            <div class="progress">
                            <div class="progress-bar bg-warning" :style="'width:'+ nlu.emotion.document.emotion.disgust*100 +'%'">
                                Disgust ({{nlu.emotion.document.emotion.joy}})
                            </div>
                            </div>

                            <!-- Red -->
                            <div class="progress">
                            <div class="progress-bar bg-danger" :style="'width:'+ nlu.emotion.document.emotion.anger*100 +'%'">
                                    Anger ({{nlu.emotion.document.emotion.joy}})
                            </div>
                            </div>
                        

                    </div>

              </div>
              
              <div>
              <label class="label">Keywords</label>

                 <p v-for="cat in nlu.keywords">
                    <span class="badge badge-info">({{cat.count}}) </span> {{cat.text}} <span class="badge badge-info">{{cat.relevance}} </span>
                </p>
              </div>
                <div>
                <label class="label">Entities</label>
                    {{nlu.entities}}
                </div>
          </div>
        </div>
</template>

<script>
'use strict';
var recognizeMicrophone = require('watson-speech/speech-to-text/recognize-microphone');

export default {
  data(){
      return {
          alternatives : [],
          result : '',
          nlu : '',
          output:''
      }
  },
    methods: {
      callback (data) {
        console.log(data.status)
        this.alternatives = []
        this.result = ''
        this.nlu = {}
        if (data.status==200){
          this.alternatives = data.data
          this.traduire()
          this.analyser()
        }
      },
      stream: function(){
          fetch('http://localhost:8088/api/speech-to-text/token')
                .then(function(response) {
                return response.json();
                })
                .then(function(token) {
                var stream = recognizeMicrophone(
                    Object.assign(token, {
                    outputElement: '#output' // CSS selector or DOM Element
                    })
                );

                stream.on('error', function(err) {
                    console.log(err);
                });
                })
                .catch(function(error) {
                console.log(error);
                });
      },
      traduire : async function(){
      let resp = await fetch('http://localhost:8088/lt',{
                  method : 'post',
                  body : JSON.stringify( {
                      source : this.source,
                      from : 'en',
                      to : 'fr'
                  }),
                  headers : {
                  'Content-type' : 'Application/json',
                  }
              }).then(res =>  res.json())
              
              .then(data => {
                  console.log(data)
                  this.result = data.translations
              })
        },
         analyser: async function(){
            let resp = await fetch('http://localhost:8088/nlu',{
                    method : 'post',
                    body : JSON.stringify( {
                        source : this.source
                    }),
                    headers : {
                    'Content-type' : 'Application/json',
                    }
                }).then(res =>  res.json())
                
                .then(data => {
                    this.nlu = data
                })
        }
    },
    computed : {
      source : function(){
        var s = this.alternatives.alternatives.map(x => x['transcript'])
        return s.toString()
      },
      visible (){
        if (this.alternatives!=null){
          return this.alternatives.alternatives!=null
        }else{
          return this.alternatives
        }
      }
    }
}
</script>
<style>
svg {
    overflow: hidden;
    vertical-align: inherit;
}
.confidence{
    color: #9E9E9E;
}
.resultat{
    background: #80DEEA;
    padding: 10px;
    border-radius: 3px;
}
.traduction{
    background: #CFD8DC;
    padding: 10px;
    border-radius: 3px;
}
.progress{
        margin: 10px 0px;
        height: 1.5rem;
}
.label{
    background: #607D8B;
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
}
.nlu{
    background: #ECEFF1;
    padding: 10px;
    margin: 15px 0;
}
.emotion{
    background: #fff;
    padding: 20px;
    margin: 15px 0;
}
</style>
