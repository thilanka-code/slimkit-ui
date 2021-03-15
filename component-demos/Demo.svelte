<script>
    import FormTableDemo from "./FormTable/FormTableDemo.svelte";
    import ResourceListDemo from "./ResourceList/ResourceListDemo.svelte";
    import TypeaheadDemo from "./Typeahead/TypeaheadDemo.svelte";
    
</script>

<style lang="scss" global>
    @import "../node_modules/bulma/bulma.sass";
</style>

<h1 class="title is-1">Svelte Element - Demo</h1>

<section class="section">
    <h1 class="title is-2">Form Table</h1>
    <FormTableDemo />
</section>
<section class="section">
    <h1 class="title is-2">Resource List</h1>
    <ResourceListDemo />
</section>
<section class="section">
    <h1 class="title is-2">Typeahead</h1>
    <TypeaheadDemo />
</section>


