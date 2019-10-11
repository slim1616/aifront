<template>
<div>
    <div class="gorm-group">
        <label for="txt">Texte à traduire</label>
        <textarea name="" id="txt" class="form-control"  v-model="source"></textarea>
    </div>
    <div class="form-group py-3">
        <button class="btn btn-primary" @click="traduire()">traduire</button>
    </div>
    <div>
        <p v-for="res in result">
            {{res.translation}}
        </p>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            source : '',
            result : ''
        }
    },
    methods:{
        traduire: async function(){
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
        }
    }
}
</script>


