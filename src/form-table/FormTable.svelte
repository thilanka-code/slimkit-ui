<script>

export let config;



</script>
{#if config.enableSearch}
  <button class="button is-primary">Add</button>
{/if}
<div class="sk-table-container">
    <table class="table is-striped is-hoverable is-fullwidth">
        <thead>
            <tr>
              <th>#</th>
              <th>Item SKU</th>
              <th><abbr title="Quantity">qty</abbr></th>
              <th>Price</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
        </thead>

        <tbody>
            <tr>
              <th>1</th>
              <td>Rice - Nipuna 10Kg</td>
              <td>4</td>
              <td>1000</td>
              <td>0.00</td>
              <td>4000.00</td>
            </tr>
            <tr>
              <th>1</th>
              <td>Rice - Nipuna 20Kg</td>
              <td>5</td>
              <td>2000</td>
              <td>0.00</td>
              <td>10,000.00</td>
            </tr>
            <tr>
              <th>1</th>
              <td>Rice - Nipuna 5Kg</td>
              <td>4</td>
              <td>500</td>
              <td>0.00</td>
              <td>2000.00</td>
            </tr>
        </tbody>
    </table>
</div>