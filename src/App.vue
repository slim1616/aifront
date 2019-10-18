<template>
  <div class="container-fluid">
    <div class="row">
        <div class="col-sm-3">
          <img src="/logo.jpg" class="img-responsive logo">
        </div>
        <div class="col-sm-7">
            <p class="title">Sintegra Labs <span class="watson">IBM WATSON</span>
            </p>
        </div>
        <div class="col-sm-2">
          <img src="/ibm_watson.png" alt="" class="img-responsive logo">
        </div>
    </div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>



<script>

    export default{
    }
</script>


<style>
body{
  font-size: 14px !important;
}
.logo{
    max-width: 65px;
    padding: 5px;
}
.title{
  color:#438bfb;
  font-size: 2em;
  margin: 10px 0;
  text-align: center;
  text-transform: uppercase;
}
.watson{
  color:#b28efd;
  font-size: 25px;
  font-weight: 600;
  font-style: italic;
}
</style>
