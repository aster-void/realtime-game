<script lang="ts">
import { goto } from "$app/navigation";
</script>

<nav class="header bg-base-100 dark:bg-base-200">
  <div class="container">
    <div class="logo">
      <a href="/" on:click={(e) => {
        e.preventDefault();
        goto('/');
      }} class="text-xl font-bold flex items-center gap-2">
        <span class="text-primary">Realtime</span>
        <span class="text-accent">Game</span>
      </a>
    </div>
    <div class="nav-links">
      <a href="/" on:click={(e) => {
        e.preventDefault();
        goto('/');
      }} class="text-base-content">Home</a>
      <a href="/rooms" on:click={(e) => {
        e.preventDefault();
        goto('/rooms');
      }} class="text-base-content">Rooms</a>
    </div>
  </div>
</nav>

<style>
  .header {
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-links a {
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.2s ease;
  }

  .nav-links a:hover {
    color: primary;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }

    .nav-links {
      gap: 1rem;
    }
  }
</style>
