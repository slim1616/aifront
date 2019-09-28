<template>
  <div class="row justify-content-center">
      <div class="loader" v-show="loading">
          <span class="spinner spinner-grow"></span>
      </div>

      <div class="col-md-8">
          <div class="card card-default">
              <div class="card-header">Visual Recognition</div>
                <input accept="image/*" type="file" id="file" ref="file" @change="onChangeFileUpload()"/>
                <button :class="{'disabled' : image==null}" :disabled="image==null" class="btn btn-success" @click="submitForm()">Go</button>
              <div class="card-body">
              </div>
          </div>
          <div id="preview">
            <img v-if="url" :src="url" style="max-width: 80%;height: auto;"/>
        </div>
      </div>
        <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center" 
                v-for="obj in sorted">{{obj.class}} 
                <span class="badge badge-info">{{obj.score}}</span> 
            </li>
        </ul>
  </div>
</template>

<script>
import axios from 'axios'
  export default {
      data(){
          return {
              image : null,
              url : null,
              loading : false,
              response : {
                    "images": [
                        {
                        "classifiers": [
                            {
                            "classifier_id": "default",
                            "name": "default",
                            "classes": [
                                {
                                "class": "waiting...  ",
                                "score": 0,
                                "type_hierarchy": ""
                                }
                            ]
                            }
                        ],
                        "image": "reservation.png"
                        }
                    ],
                    "images_processed": 1,
                    "custom_classes": 0
                    }
          }
      },
      methods:{
          submitForm(){
              if (this.image!=null){
                this.loading = true
                let formData = new FormData();
                formData.append('image', this.file);
    
                this.axios.post('http://localhost:8088/upload',
                    formData,
                    {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                )
                .then(data => {
                console.log(data.data)
                this.response = data.data
                this.loading = false
                })
                .catch(err => {
                    alert('Erreur.. ' + err.message)
                    this.loading = false
                    });
            }
      },
  
        onChangeFileUpload(){

              const image = this.$refs.file.files[0];
                this.image = image
              this.url = URL.createObjectURL(image);
                const reader = new FileReader();

            this.file = this.$refs.file.files[0];
        }
      },
      computed:{
          classes(){
              return this.response.images[0].classifiers[0].classes
          },
           sorted(){
              let sort = this.classes.sort((a, b) => (a.score > b.score) ? 1 : -1)
              return sort.reverse()
          }
      }
  }
</script>


<style>
    .loader{
        background: #f0f8ff3b;
        position: fixed;
        z-index: 9999;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
    }
    .loader .spinner {
        top: 50%;
        position: relative;
        left: 50%;
        color: #9c1cb0;
    }
</style>
