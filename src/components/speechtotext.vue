<template>
    <div>
        
        
        <div class="row">
            <div class="col-sm-12">
                <div style="top: 35px;position: relative;z-index: 9999;left: 5px;">
                        <div class="">
                            <b-button v-b-toggle.collapse-2 class="m-1" style="background: #c4a8fd;border: none;"><i class="fa fa-file-audio"></i></b-button>

                            <!-- Element to collapse -->
                            <b-collapse id="collapse-2">

                                    <input accept="audio/*" type="file" id="file" ref="file" @change="onChangeFileUpload()"/>
                                    <button @click="submitson">Go</button>
                            </b-collapse>
                        </div>
                        <div class="">
                            <b-button v-b-toggle.collapse-1 class="m-1"><i class="fa fa-terminal"></i></b-button>

                            <!-- Element to collapse -->
                            <b-collapse id="collapse-1">
                                
                                <div class="tasks">
                                    <pre style="color:#fff">{{tache}}</pre>
                                    </div>
                            </b-collapse>
                        </div>

                    </div>
                <audio-recorder :src="audio"
                    upload-url="http://pinsights-slim.eu-gb.mybluemix.net/stt"
                    filename="minip"
                    format="wav"
                    :before-recording="callbefore"
                    :pause-recording="callpause"
                    :after-recording="callafter"
                    :before-upload="cb"
                    :successful-upload="callback"
                    :failed-upload="callfailed"
                    :select-record="callSelect"/>

                  
            </div>
        </div>
            <div class="row" style="margin-top: 20px;">
             
                <div class="col-sm-6 border">
                        <img src="/logo.jpg" v-if="!visible" class="img-responsive d-block loading"> 
                         <div v-if="visible">
                            <a href="javascript:;" :class="{active : show=='texte'}" class="link" @click="changeShow('texte')">Texte</a>
                            <a href="javascript:;" :class="{active : show=='traduction'}" class="link" @click="changeShow('traduction')">Traduction</a>
                        </div>
                        <div v-if="show=='texte'">
                            <p  class="resultat" v-for="res in alternatives.alternatives">
                                {{res.transcript}} <span class="confidence">({{res.confidence}})</span>,
                            </p>  
                        </div>
                        <div v-if="translations.length>0">
                            <div v-if="show=='traduction'"> 
                                <p class="traduction" v-for="res in translations">
                                    {{res.translation}}
                                </p>
                                <div class="form-group flex">
                                    <select class="form-control" v-model="selectedVoice" style="height:54px;width: auto;">
                                        <option></option>
                                        <option v-for="voice in voicesLang">{{voice.name}}</option>
                                    </select>
                                    <button class="btn btn-volume" @click="synthesize"><i class="fa fa-volume-up"></i></button>
                                    <audio ref="player" preload="auto" controls>
                                        <source :src="audio" type="audio/mp3">
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            </div>
                        </div>
                </div>
                      
                        
                        
                        
            <div class="col-sm-6 border">
               <img src="/logo.jpg" v-if="!emotions" class="img-responsive d-block loading"> 
               <div class="emotion">
                   <div v-if="emotions" class="emotions-div">Emotions</div>
                    <div v-if="emotions">
                        <div v-for="emotion in emotions" class="progress">
                            <div  class="progress-bar" :style="'width:'+ emotion.score*100 +'% ;background :' + emotion.color">
                                <span> {{emotion.emotion}} ({{(emotion.score*100).toFixed(2)}}%)</span>
                            </div>
                        </div>
                    </div>

              </div>

              
                </div>
            </div>

            <div class="row">


                    <div class="col-sm-6 border">
                       <img v-if="nlu.sentiment==null" src="/logo.jpg" class="img-responsive d-block loading"> 
                        <div v-if="nlu.sentiment" class="nlu-contents">
                            <div class="sentiments first-sentiment" >Sentiment </div>
                            <div class="sentiments" :class="[nlu.sentiment.document.label=='negative'? 'negative' : 'positive']">{{nlu.sentiment.document.label}}</div>
                            <div class="sentiments" :class="[nlu.sentiment.document.label=='negative'? 'negative' : 'positive']">{{nlu.sentiment.document.score}}</div>
                        </div>
                       
                        <div class="nlu-data">
                            <div v-if="nlu.entities!=null"> 
                                <ul class="list-group">
                                    <li class="li-1 list-group-item justify-content-between align-items-center">
                                            Entities
                                        </li>
                                        <li v-for="entitie in nlu.entities"class="list-group-item d-flex justify-content-between align-items-center">
                                            {{entitie.text}} ({{entitie.type}})
                                            <span class="badge badge-primary badge-pill">{{entitie.relevance}}</span>
                                        </li>
                                    
                                </ul>

                            </div>
                            <div v-if="nlu.concepts!=null"> 
                                <ul class="list-group">
                                    <li class="li-1 list-group-item justify-content-between align-items-center">
                                        Concepts
                                    </li>

                                <li v-for="cat in nlu.concepts" class="list-group-item d-flex justify-content-between align-items-center">
                                        {{cat.text}}
                                        <span class="badge badge-primary badge-pill">{{cat.relevance}}</span>
                                    </li>
                                </ul>
                    
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-sm-6 border">
                        <div  v-if="insights!=null" class="personnality-div">Personality Insight (Big 5)</div>
                         <span v-if="insights!=null" class="nbwords" :style="nbWordStyle">{{word_count}} mots</span>
                         <span v-if="Pierror!=''" class="d-block error-pi">{{Pierror}}</span>
                            
                            <div v-if="insights!=null" style="margin-top:15px">
                                <sunburst :data="insights">
                                        <!-- Add behaviors -->
                                        <template slot-scope="{ on, actions }">
                                            <highlightOnHover v-bind="{ on, actions }"/>
                                            <zoomOnClick v-bind="{ on, actions }"/>
                                        </template>
                                        
                                        <!-- Add information to be displayed on top the graph -->
                                         

                                        
                                        <!-- Add bottom legend -->
                                        <breadcrumbTrail slot="legend" slot-scope="{ nodes, colorGetter, width }" :current="nodes.mouseOver" :root="nodes.root" :colorGetter="colorGetter" :from="nodes.clicked" :width="width" />
                                        
                                        </sunburst>
                            </div>
                            <img src="/logo.jpg" v-if="insights==null && Pierror==''" class="img-responsive d-block loading"> 
                    </div>
                    
                </div>

        </div>
</div>
</template>

<script>
import {
  breadcrumbTrail,
  highlightOnHover,
  nodeInfoDisplayer,
  sunburst,
  zoomOnClick
} from 'vue-d3-sunburst';
    import "vue-d3-sunburst/dist/vue-d3-sunburst.css";
    

export default {
    components: {
    breadcrumbTrail,
    highlightOnHover,
    nodeInfoDisplayer,
    sunburst,
    zoomOnClick
  },
  data(){
      return {
          emotions : null,
          Pierror :'',
          tache : '',
          show : 'texte',
          son : null,
          alternatives : [],
          translations : '',
          nlu : '',
          output:'',
          selectedVoice : 'fr-FR_ReneeV3Voice',
          voicesLang : [],
          tone : '',
          audio : '',
          insights : null,
          word_count : 0,

                        
      }
  },
    methods: {
        changeShow (value){
            console.log(value)
            this.show = value
        },
         onChangeFileUpload(){

                const son = this.$refs.file.files[0];
                console.log(son)
                this.son = son
                this.url = URL.createObjectURL(son);
                //this.file = this.$refs.file.files[0];
        },
        submitson: async function(){
            let formData = new FormData();
            formData.append('audio', this.son);
            console.log(formData)
            this.tache = ''
            this.Pierror = ''
            this.tache += 'Analyse Voice... \n'
            this.axios.post('http://pinsights-slim.eu-gb.mybluemix.net/stt',
                    formData,
                    {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(data => {
                    this.tache += 'Analyse Voice Completed \n'
                this.alternatives = data.data
                console.log(data.data)
                this.traduire()
                this.nluAnaluyse()
                this.Pinsights()

                })
                .catch(err => {
                    alert('Erreur.. ' + err.message)
                    this.loading = false
                    });
        },
        callafter (data){
            console.log('callafter ' + data)
        },
        callpause (data){
            
            console.log('callpause')
        },
        callbefore (data){
            console.log('callbefore')
        },
        callSelect (data){
            console.log('callSelect ' + JSON.stringify(data))
        },
        cb (data){
            console.log('cb')
        },
        callfailed (data){
            console.log('callfailed '  + data)
        },
        call (data){
            console.log('call ' + JSON.stringify(data))
        },
      callback (data) {
        console.log("callback " + data)
        this.alternatives = []
        this.translations = ''
        this.nlu = {}
        this.tache = ''
        this.Pierror = ''
        this.tache += 'Analyse Voice... \n'
        if (data.status==200&&data.statusText=="OK"){
            this.tache += 'Analyse Voice Completed \n'
          this.alternatives = data.data
          this.traduire()
          this.nluAnaluyse()
          this.Pinsights()
        }
      },
      getListVoices: async function(){
          this.tache += 'get voices languages... \n'
              this.loading = true
              let res = await fetch('http://pinsights-slim.eu-gb.mybluemix.net/getvoices')
              .then(resp => resp.json())
              .then(data => {
                  this.voicesLang = data.voices
                  this.loading = false
                  this.tache += 'get voices languages Ok \n'
              })
              .catch(err => {
                  console.log(err)
                  this.loading = false
                  })

          },
          synthesize: async function(){
              this.tache += 'Synthesize in progress \n'
              if (this.text!=""){
                  this.loading = true
                  console.log(this.text)
                    let res = await fetch('http://pinsights-slim.eu-gb.mybluemix.net/synthesize',{
                        method : 'post',
                        body : JSON.stringify( {
                            text : this.translationText,
                            name : this.selectedVoice
                        }),
                        headers : {
                        'Content-type' : 'Application/json',
                        }
                    })
                    .then(resp => resp.json())
                    .then(data => {
                        this.audio = 'http://pinsights-slim.eu-gb.mybluemix.net/waves/'+data.filename
                        window.open(this.audio,'_blank');
                        this.loading = false
                        this.$refs.player.load()
                        this.tache += 'Synthesize completed \n'
                            
                    })
                    .catch(err => {

                            console.log(err)
                            this.loading = false

                        this.loading = false
                        })
               }
          },
      traduire : async function(){
          this.tache += 'Translation in progress \n'
      let resp = await fetch('http://pinsights-slim.eu-gb.mybluemix.net/lt',{
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
                  this.translations = data.translations
                  this.word_count = data.word_count
                  this.tache += 'Translation completed \n'
              })
        },

        Pinsights : async function(){
            this.tache += 'Personnality Insight Analysing... \n'
            let resp = await fetch('http://pinsights-slim.eu-gb.mybluemix.net/pi',{
                    method : 'post',
                    body : JSON.stringify( {
                        source : this.source
                    }),
                    headers : {
                    'Content-type' : 'Application/json',
                    }
                }).then(res =>  res.json())
                
                .then(data => {
                    console.log(data.message)
                    if (!data.message){
                        var json = data.personality
                        var ch = JSON.stringify(json)
                        var ch1 = ch.replace(/"percentile"/g,"\"size\"")
                        var obj = JSON.parse(ch1)
                        this.insights = { "name" : "test", "children": obj}
                        // console.log(this.insights)
                        this.tache += 'Personnality Insight Completed \n'
                    }else{
                        this.tache += 'Personnality Insight Error \n'
                        this.Pierror = data.message
                    }
                })
                .catch(err => {

                    console.log(err)
                    this.tache += 'Personnality Insight Error \n'
                })

        },
         nluAnaluyse: async function(){
             this.tache += 'NLU in progress \n'
            let resp = await fetch('http://pinsights-slim.eu-gb.mybluemix.net/nlu',{
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
                    this.analyser()
                    this.tache += 'NLU Completed Analyse \n'
                })
        },
        analyser: async function(){
            this.tache += 'Analysing Tones \n'
            let resp = await fetch('http://pinsights-slim.eu-gb.mybluemix.net/toneanalyzer',{
                        method : 'post',
                        body : JSON.stringify( {
                            source : this.source
                        }),
                        headers : {
                        'Content-type' : 'Application/json',
                        }
                    }).then(res =>  res.json())
                    
                    .then(data => {
                        console.log(data)
                        this.tone = data.document_tone.tones
                        var emotions = this.nlu.emotion.document.emotion
                        console.log('emotions : ' + JSON.stringify(emotions))
                        var s = this.tone.map(ton => {
                            console.log(ton)
                            if (!emotions.hasOwnProperty(ton.tone_id)){
                                emotions[ton.tone_id] = ton.score
                            }
                        })
                        var arr = [];
                        for (let [key, value] of Object.entries(emotions)) {
                        let item = {};
                            item.emotion = `${key}`;
                            item.score = `${value}`;
                            item.color = '#' + Math.floor(Math.random()*16777215).toString(16);
                            arr.push(item);
                        }
                        console.log(arr);
                        this.emotions = arr
                        console.log('this.emotions  after : ' + JSON.stringify(this.emotions))
                        this.tache += 'Analysing Tones Completed \n'
                    })
        }
    },
    computed : {
       nbWordStyle (){
            if (this.word_count==0){
                return {background : '#b28efd'}
            }else if (this.word_count<100){
                return {background : '#dc3545'}
            }else if (this.word_count<600){
                return {background : '#ffc107'}
            }else if (this.word_count<1200){
                return {background : '#17a2b8'}
            }else{
                return {background : '#28a745'} 
            }
       },
      source : function(){
        var s = this.alternatives.alternatives.map(x => x['transcript'])
        return s.toString()
      },
      translationText : function(){
            var s = this.translations.map(x => x['translation'])
            return s.toString()
      },
      visible (){
        if (this.alternatives!=null){
          return this.alternatives.alternatives!=null
        }else{
          return this.alternatives
        }
      }
    },
    mounted(){
        this.getListVoices()
         
        
    },
    created(){
        

        
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
    max-height: 120px;
    overflow: auto;
}
.traduction{
    background: #CFD8DC;
    padding: 10px;
    border-radius: 3px;
    max-height: 120px;
    overflow: auto;
}
.progress{
    margin: 8px 0px;
    height: 1.3rem;
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
    margin: 15px 0 0 0;
}
.ar-records{
    height: auto !important;
    margin-bottom: 0 !important;
    background: azure !important;
}
.ar{
    width: 100% !important;
    box-shadow: 0 4px 3px 0 rgba(0, 0, 0, 0.17) !important;
        margin-top: -85px !important;
}
.ar-recorder__records-limit {
    position: relative !important;
    top: 0 !important;;
    margin: 5px 0 !important;
}
.ar-recorder__duration{
    margin: 5px 0 !important;
}
.flex{
    display: flex;
}
.link{
    padding: 10px;
    text-decoration: none;
    color: #b28efd;
    background: #FFF;
    margin-right: 2px;
    display: inline-block;
}
.link:hover,.active{
    color: #438bfb;
    background: #eee;
    text-decoration: none;
    transition: background .5s ease;
}
.border{
    border: solid 1px #eee;
}
.nbwords{
    background: #ebe3fd;
    color: #fff;
    padding: 10px 10px;
    top: 0;
    right: 0;
    position: absolute;
}
.loading{
    width: auto;
    height: 110px;
     animation : pulse 1s infinite ease-in-out;
    -webkit-animation : pulse 1s infinite ease-in-out;
    margin-right: auto;
    margin-left: auto;
}
.btn-volume{
    background: #eee;
    border-radius: 50%;
    margin: 5px;
}
.tasks{
    position: absolute;
    top: 0px;
    right: 70px;
    z-index: 9999;
    background: #000;
    opacity: .7;
    padding: 4px;
}
.error-pi{
    background: #b42727;
    padding: 4px 7px;
    color: #fff;
    text-align: center;
    margin: 40px 15px;
    font-size: 1.3em;
    border-radius: 3px;
}
.progress-bar{
    color : #000;
    padding: 5px 20px;
}
.nlu-contents{
    height: 41px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: stretch;
    background: #eee;
    margin: 0px -15px;
}
.sentiments{
    padding:10px 10px;
    color: #FFF;
    margin-right: 2px;
}
.first-sentiment{
    color: #428bfb;
    font-size: 1em;
    font-weight: 700;
}
.negative{
    background: #b42727;
}
.positive{
    background: #14bc14;
}
.nlu-data{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 10px;
}
.li-1{
    background: #b28efd;
    color: #FFF;
    text-align: center;
    font-size: 1.2em;
    font-weight: 600;
}
.emotions-div{
    background: #b28efd;
    margin: -15px -15px -0 -15px;
    padding: 8px;
    color: #FFF;
    font-size: 1.2em;
    font-weight: 700;
    text-align: center;
}
.ar-content{
    padding: 5px !important;
}
.personnality-div{
    background: #b28efd;
    margin: 0px -15px 0 -15px;
    padding: 8px;
    color: #FFF;
    font-size: 1.2em;
    font-weight: 700;
    text-align: center;
}
 @keyframes pulse
    {
        0%{
            opacity: .1;
        }
        50%{
            opacity: .5;
        }
        100%{
            opacity: .1;
        }
    }
    @-webkit-keyframes pulse
    {
        0%{
            opacity: .1;
        }
        50%{
            opacity: .5;
        }
        100%{
            opacity: .1;
        }
    }
</style>
