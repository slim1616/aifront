<template>
  <div class="container">
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/tts" class="nav-link">Text to speech</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/vr" class="nav-link">Visual Recognition</router-link>
        </li>
      </ul>
    </nav><br />
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style>
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s ease-in;
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }
</style>

<script>

    export default{
    }
</script>