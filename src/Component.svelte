<script>
  export let name;
  export let buttonText = "Button";

  function handleClick() {
    buttonText += " Clicked";
  }
</script>

<!-- your code here -->
<h1>Hello {name}!</h1>

<button id="btn" class="my-btn" on:click={handleClick}>{buttonText}</button>
