<template>
    <div>
        <div class="gorm-group">
            <label for="txt">Texte à analyser</label>
            <textarea name="" id="txt" class="form-control"  v-model="source"></textarea>
        </div>
        <div class="form-group py-3">
            <button class="btn btn-primary" @click="analyser()">Analyser</button>
        </div>
        <div style="max-width:90%">



        </div>

    </div>
</template>
<script>

export default {
     data(){
        return{
            source : 'Team, I know that times are tough! Product ',
            result : ''
        }
    },
    methods:{
        analyser: async function(){
            let resp = await fetch('http://localhost:8088/toneanalyzer',{
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
                        this.result = data
                    })
        }
    }
}
</script>
