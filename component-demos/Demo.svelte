<script>
    import FormTableDemo from "./FormTable/FormTableDemo.svelte";
    import DataTableDemo from "./DataTable/DataTableDemo.svelte";
    import ResourceListDemo from "./ResourceList/ResourceListDemo.svelte";
    import SidebarDemo from "./Sidebar/SidebarDemo.svelte";
    import TypeaheadDemo from "./Typeahead/TypeaheadDemo.svelte";
import TreeTableDemo from "./TreeTable/TreeTableDemo.svelte";
    
</script>

<style lang="scss" global>
    @import "../node_modules/bulma/bulma.sass";
    .primary-demo {
        color: $primary;
    }

    .primary-light-demo {
        &:hover {
            background-color: $primary-light;
        }
    }

    .primary-invert-demo {
        &:hover {
            color: $primary-invert;
        }
    }
    
    .primary-dark-demo {
        &:hover {
            background-color: $primary-dark;
        }
    }
    
    .primary-invert-text {
        background-color: $primary;
        color: $primary-invert;
    }
    
    .primary-invert-highlight{
        
        // color: $primary-light;
        &:hover {
            background-color: $primary-light;
        }
    }

    .primary-highlight{
        background-color: $primary;
        color: $primary-invert;
        &:hover {
            background-color: $primary-dark;
        }
    }
</style>

<h1 class="title is-1">Svelte Element - Demo</h1>

<h1 class="title is-3">Theming guide</h1>

<p>Override following SCSS variables:</p>
<ul>
    <li><div class="primary-demo">$primary - This is the main color</div></li>
    <li><div class="primary-light-demo">$primary-light - Hover over this to see the background color change</div></li>
    <li><div class="primary-dark-demo">$primary-dark - Hover over this to see the background color change</div></li>
    <li><div class="primary-invert-demo">$primary-invert - Hover over this to see the text color change</div></li>
</ul>    

<p>General rules of thumb:</p>
<ul>
    <li><div class="primary-demo">Text should have the inverse color of the background - just like here</div></li>
    <li><div class="primary-invert-text">Or the other way around - like here</div></li>
    <li><div class="primary-highlight">$primary background should be highlighted/mixed with $primary-dark  </div></li>
    <li><div class="primary-invert-highlight">$primary-invert background should be highlighted/mixed with $primary-light  </div></li>
</ul>




<SidebarDemo />

<h1 class="title is-1">Svelte Element - Demo</h1>

<section class="section">
    <h1 class="title is-2">Data Table</h1>
    <DataTableDemo />
</section>
<section class="section">
    <h1 class="title is-2">Form Table</h1>
    <FormTableDemo />
</section>
<section class="section">
    <h1 class="title is-2">Resource List</h1>
    <ResourceListDemo />
</section>
<section class="section">
    <h1 class="title is-2">Tree Table</h1>
    <TreeTableDemo />
</section>
<section class="section">
    <h1 class="title is-2">Typeahead</h1>
    <TypeaheadDemo />
</section>


