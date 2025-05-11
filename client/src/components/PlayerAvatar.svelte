<script lang="ts">
  export let name: string;
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  
  const sizeClasses = {
    'xs': 'w-6 h-6 text-xs',
    'sm': 'w-8 h-8 text-sm',
    'md': 'w-12 h-12 text-base',
    'lg': 'w-16 h-16 text-lg'
  };
  
  const getInitial = (name: string) => name ? name[0].toUpperCase() : 'U';
</script>

<div class="avatar placeholder">
  <div class={`${sizeClasses[size]} rounded-full bg-neutral text-neutral-content`}>
    <span>{getInitial(name)}</span>
  </div>
</div>
