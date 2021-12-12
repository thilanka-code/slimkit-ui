<script>
  import { onMount } from "svelte";
  import { SVG } from "@svgdotjs/svg.js";

  export let client_data; // readable store provided by the client
  export let column_labels;
  export let table_options;

  let table_outer_element;
  let table_body_element;
  let svgTableScrollContainer;
  let svgTableHorizontalScrollContainer;
  let draw;
  let cell_draw;
  let scroll_draw;
  let scroll_draw_horizontal;
  let columns;
  let row_group = undefined;
  let rectx = -1;
  let textx = -1;
  let draw_count = 0;
  let visible_calc = 0;
  // Client input

  const col_height = 35;
  const data_cell_height = 25;
  const scroll_bar_width = 15;
  // const rows_visible = Math.round(get_table_body_height()/data_cell_height << 0
  let _visible_rows_rounded;
  let rows_visible;
  let row_cell_value_padding_top = 5;
  let row_cell_value_padding_left = 5;
  let scroll_grabber_pressed = false;
  let scroll_grabber_height = 400;
  let scroll_grabber_left_padding = 3;
  let scroll_grabber_top_padding = 3;
  let last_scroll_y = 0;
  const rows_drawn_range = { start_index: 0, end_index: 0 }; //updated by?
  const max_rendered_rows = 1000; //If it scrolls beyond, the top rows will be removed
  let buffered_rows = -1;
  let buffered_rate = 0.01; // Buffer 1% of rows
  let draw_buffered_rate = 0.75; // Redraw buffer when 75% of buffer is scrolled
  let last_scroll_translation_y = 0; //last moved direction length
  let last_scroll_direction = 0; //last moved direction 0 = up 1 = down
  let cell_redrawn = false; //rows redrawn on the last translation
  let scroll_wait = false;
  let scroll_grabber = undefined;
  let scroll_grabber_color = "rgba(181, 181, 181, 0.301)";
  let scroll_grabber_hover = "rgba(181, 181, 181, 0.63)";
  let scroll_grabber_touched = "rgb(181, 181, 181)";
  let svg_table_header_width;
  let table_height_cached;
  let no_c = 0;

  let row_data = [
    // { id: '1', name: 'Frst Comp', prot: 'FIX' },
    // { id: '2', name: 'Sec Compooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo', prot: 'FIX' },
    // { id: '3000000000000000000000000000000000000000000000000000000', name: 'ABCDCHFdsdfks', prot: 'FIX3' },
  ];

  $: {
    console.log("client data comp");
    console.log(client_data);
    on_data_change(client_data);
  }

  function on_data_change(data) {}

  onMount(() => {
    // 1. Draw table headers
    // 2. Set the table_body_element height (tbl H - col H)
    console.log("get b h: " + get_table_body_height());
    table_body_element.style.height = get_table_body_height() + "px";

    let render_start = new Date();
    _visible_rows_rounded = Math.round(
      get_table_body_height() / data_cell_height
    );
    rows_visible =
      _visible_rows_rounded < get_table_body_height() / data_cell_height
        ? _visible_rows_rounded + 1
        : _visible_rows_rounded;
    ////////////////////////////// Increase data /////////////////////////////////
    for (let i = 0; i < 1000; i++) {
      row_data.push({ id: "" + i, name: "Auto Comp", prot: "FIX", col1:"one", col2:"tw", col3:"thr",col4:"four",col5:"five", });
    }

    buffered_rows = Math.round(row_data.length * buffered_rate); //What if rows are less than viewport height
    //Table configs
    columns = column_labels.map((lbl) => {
      return { label: lbl };
    });

    console.log("Data creation time:  " + (new Date() - render_start));

    // draw = SVG().addTo(".svg-table-header").size("100%", col_height).move(0, 0);
    draw = SVG().addTo(".svg-table-header").move(0, 0);
    cell_draw = SVG().addTo(".svg-table-body").size("100%", "100%");
    scroll_draw = SVG()
      .addTo(".svg-table-scroll-container")
      .size("100%", "100%");
    scroll_draw_horizontal = SVG()
      .addTo(".svg-table-horizontal-scroll-container")
      .size("100%", "100%");

    draw_header(columns);

    render_start = new Date();
    update_rows_initial(get_visible_row_data(true), 0, true);
    // update_rows_initial(row_data)
    // console.log(rows_drawn_range)

    // update_viewport_cells(get_visible_row_data())

    console.log("Rows Creation Time: " + (new Date() - render_start));
    update_scroll_bar();
  });

  function draw_header(columns) {
    draw.clear();
    let index = 0;
    let column_x = 0;

    for (const column of columns) {
      // let col_width = 100
      let col_width = get_column_width(column);
      // console.log(col_width);
      // console.log('cwd:' + col_width);
      let col_x = col_width * index;
      let col_lable_padding_left = 5;
      let col_lable_padding_top = 0;
      let col_center = (col_width * 50) / 100;

      // let d = draw.group()
      let nest = draw.nested().move(col_x, 0);
      nest.attr({ width: col_width });
      nest.addClass("svg-header-cell-container");
      
      let header_cell = nest
      .rect(col_width, col_height)
      .attr({ fill: "f60", stroke: "#000", "stroke-width": 1 });
      header_cell.addClass("header-cell");
      let text = nest
        .text(column.label)
        .move(col_center, col_lable_padding_top);
      // text.text(get_text_ellipsis(column.label, text, col_width))
      text.text(
        get_text_ellipsis(
          column.label,
          text,
          col_width,
          col_lable_padding_left * 2
        )
      );
      let col_label_length = text.length();

      text.addClass("header-label");

      // let header_cell = d.rect(col_width, col_height).attr({ fill: '#f06', stroke: '#000', 'stroke-width': 1 }).move(col_x, 0);

      index++;
    }

    // draw.size(300*columns.length, col_height)
    draw.size(table_options.max_width, col_height)

    //Cache table header width for performance (svg-table-header)
    get_table_width();
  }

  function get_column_width(column) {
    // return 300
    // let col_width = get_table_width() / columns.length;
    let col_width = table_options.max_width / columns.length;
    // console.log('vvvvvvv' + col_width_default);

    if (column.width) {
      //NOT IMPLEMENTED
      if (column.width.search("%") > -1) {
      } else if (column.width.search("px") > -1) {
        column_x += Number.parseInt(column.width.replace("px", ""));
      }
    }
    return col_width;
  }

  function get_scroll_grabber_height() {
    let data_render_length = row_data.length * data_cell_height;

    if (data_render_length > get_table_body_height()) {
      return (
        (get_table_body_height() / data_render_length) * get_table_body_height()
      );
    }
    return 0;
  }

  function get_scroll_grabber_top_relative_to_parent() {
    return (
      scroll_grabber.node.getBoundingClientRect().top -
      svgTableScrollContainer.getBoundingClientRect().top -
      scroll_grabber_top_padding
    );
  }

  function get_scrolled_percent() {
    return (
      scroll_grabber.transform().translateY /
      (get_scroll_bar_length() - get_scroll_grabber_height())
    );
  }

  function get_table_height() {
    if (table_height_cached) {
      return table_height_cached;
    }
    table_height_cached = table_outer_element.offsetHeight;
    return table_height_cached;
  }

  function get_table_body_height() {
    return get_table_height() - col_height;
  }

  function get_rows_scroll_amount_from_scrollbar_scrolled(
    scroll_translation_signed
  ) {
    let total_data_render_length = row_data.length * data_cell_height;
    let scrollable_length = total_data_render_length - get_table_body_height();
    return (
      -(
        scroll_translation_signed /
        (get_scroll_bar_length() - get_scroll_grabber_height())
      ) * scrollable_length
    ); //Inverting!!!!
  }

  function get_scroll_bar_length() {
    return get_table_height() - scroll_grabber_top_padding * 2 - col_height;
  }

  function get_scrollable_height() {
    return get_scroll_bar_length() - get_scroll_grabber_height();
  }

  function get_table_width() {
    //hot code path optimized by caching
    if (svg_table_header_width) {
      return svg_table_header_width;
    }
    svg_table_header_width = document.getElementById("svg-table-header")
      .offsetWidth;
    return svg_table_header_width;
  }

  /**
   * PERFORMANCE BOTTLENECK
   * @param label
   * @param svg_text_node
   * @param max_length
   * @param padding
   * @returns {string|*}
   */
  function get_text_ellipsis(label, svg_text_node, max_length, padding) {
    return label;
    let text_out = label;
    let index = 1;
    for (let i = 0; i < label.length; i++) {
      if (
        svg_text_node.text(text_out.slice(0, i + 1)).length() >=
        max_length - padding
      ) {
        return (
          svg_text_node.text().substring(0, svg_text_node.text().length - 3) +
          "..."
        );
      }
    }

    return label;
  }

  function scroll(scroll_translation_signed, direction) {
    let total_data_render_length = row_data.length * data_cell_height;
    let scrollable_length = total_data_render_length - get_table_body_height();
    let scroll_requirement_signed = get_rows_scroll_amount_from_scrollbar_scrolled(
      scroll_translation_signed
    );
    // console.log(`REQ: ${scroll_requirement_signed}`);
    //calculate allowed travel distance
    let allowed_translate_y;
    if (direction == "down") {
      //grabber going up rows going down
      allowed_translate_y =
        -row_group.transform().translateY + -scroll_requirement_signed >
        scrollable_length
          ? -(scrollable_length + row_group.transform().translateY)
          : scroll_requirement_signed;
      //Draw rows
      // console.log('aaaaaaaaaaaaaaaaaaaaa:'+allowed_translate_y)
      update_scrolling_rows(allowed_translate_y);
      // row_group.translate(0, allowed_translate_y);
      allowed_translate_y =
        row_group.node.transform.baseVal.getItem(0).matrix.f +
        allowed_translate_y;
      row_group.node.transform.baseVal
        .getItem(0)
        .setTranslate(0, allowed_translate_y);
    } else {
      //+scroll_requirement_signed   row_group.transform().translateY  - => +
      allowed_translate_y =
        scroll_requirement_signed + row_group.transform().translateY > 0
          ? -row_group.transform().translateY
          : scroll_requirement_signed;
      update_scrolling_rows(allowed_translate_y);
      // row_group.translate(0, allowed_translate_y);
      allowed_translate_y =
        row_group.node.transform.baseVal.getItem(0).matrix.f +
        allowed_translate_y;

      row_group.node.transform.baseVal
        .getItem(0)
        .setTranslate(0, allowed_translate_y);
    }
  }

  function update_scrolling_rows(rows_scroll_translation_signed) {
    //Append missing rows to the row_group
    if (rows_scroll_translation_signed == 0) return;
    if (rows_scroll_translation_signed < 0) {
      //scrolling down data rows going up
      const visible_range = get_visible_rows_range(
        rows_scroll_translation_signed
      );

      if (rows_drawn_range.end_index < visible_range.end + buffered_rows) {
        // console.log('down....');
          update_rows_initial(
            row_data.slice(
              rows_drawn_range.end_index,
              visible_range.end + buffered_rows + 1
            ),
            0,
            false
          ); //get rows arr from row index range
        }
      } else {
        //Going down
      }
  }

  /**
   * PERFORMANCE BOTTLENECK!!!!!!!!!
   * @param rows
   * @param start_row_index
   * @param is_initial_draw
   */
  function update_rows_initial(rows, start_row_index, is_initial_draw) {
    if (is_initial_draw) {
      cell_draw.clear();
      row_group = cell_draw.group();
      row_group.node.setAttribute("transform", "translate(0,0)")
      console.log(row_group.node);
    }
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxx')
    rows_drawn_range.start_index = start_row_index; //not needed

    let drawn_end =
      rows_drawn_range.end_index == undefined ? 0 : rows_drawn_range.end_index;
    // console.log('kk:'+drawn_end)
    let i = 0;

    for (i; i < rows.length; i++) {
      let col_index = 0;
      let nested = create_group();
      for (const column in rows[i]) {
        if (rows[i].hasOwnProperty(column)) {
          const col_value = rows[i][column];
          let col_width = get_column_width(columns[col_index]);
          let col_x = col_width * col_index;
          // let move_y = !is_initial_draw ? i + drawn_end + 50 : i + drawn_end
          let move_y = i + drawn_end;
          // let nestedy = nested.nested().move(col_x, data_cell_height * move_y)
          let nestedy = create_nested(col_x, data_cell_height * move_y, nested);

          nestedy.addClass("row-cell");
          // rectx = nestedy.rect(col_width, data_cell_height).attr({stroke: '#000', 'stroke-width': 1})
          rectx = draw_rect(nestedy, col_width, data_cell_height, "#000", 1);
          // let text = nestedy.text(col_value).attr({fill: '#000'}).move(0, row_cell_value_padding_top)
          let text = draw_text(
            nestedy,
            col_value,
            "#000",
            0,
            row_cell_value_padding_top + data_cell_height / 2
          );
          // console.log('drawn_end val:'+drawn_end)
          textx = text;
          // text.text(get_text_ellipsis(col_value, text, col_width, row_cell_value_padding_left * 2))
          set_text(
            text,
            get_text_ellipsis(
              col_value,
              text,
              col_width,
              row_cell_value_padding_left * 2
            )
          );
        }
        col_index++;
      }
      // console.log('drawn')
    }
    if (i != 0) rows_drawn_range.end_index += i - 1;
  }

  function create_group() {
    return row_group.group();
  }

  function draw_rect(group, width, height, fill, line_width) {
    //1.2%
    return group
      .rect(width, height)
      .attr({ stroke: fill, "stroke-width": line_width });
  }

  function draw_text(group, value, fill, translate_x, translate_y) {
    // console.log(group.node)
    // const text_node = group.node.createElementNS('http://www.w3.org/2000/svg', 'text');
    const text_node = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    // text_node.setAttribute('width','187');
    // text_node.setAttribute('height','234');
    text_node.setAttribute("fill", fill);
    text_node.setAttribute("x", translate_x);
    text_node.setAttribute("y", translate_y);
    text_node.textContent = value;
    return group.node.appendChild(text_node);
    // return group.text(value).attr({fill: fill}).move(translate_x, translate_y)
    return text_node;
  }

  function set_text(svg_text, text_value) {
    svg_text.textContent = text_value;
    // svg_text.text(text_value)
  }

  function create_nested(x, y, group) {
    //cpu 4.3%
    return group.nested().move(x, y);
  }

  function update_scroll_bar() {
    scroll_draw.clear();
    let nested = scroll_draw.nested();
    // svgTableScrollContainer.style.width = scroll_bar_width + "px";
    // svgTableScrollContainer.style.left =
    //   get_table_width() - scroll_bar_width + "px";
    let scroll_bar = nested
      .rect(scroll_bar_width, get_table_height())
      .attr({ stroke: "#000", "stroke-width": 1 });
    scroll_grabber = nested
      .rect(
        scroll_bar_width - scroll_grabber_left_padding * 2,
        get_scroll_grabber_height()
      )
      .attr({
        fill: scroll_grabber_color,
        stroke: "#000",
        "stroke-width": 0.25,
      })
      .move(scroll_grabber_left_padding, scroll_grabber_top_padding);
    scroll_grabber.mousedown((e) => {
      scroll_grabber.node.style.fill = scroll_grabber_touched;
      scroll_grabber_pressed = true;
      e.preventDefault(); // To prevent text selection
    });

    scroll_grabber.mouseup(() => {
      scroll_grabber.node.style.fill = scroll_grabber_color;
    });

    document.body.addEventListener(
      "mouseup",
      (evt) => {
        scroll_grabber_pressed = false;
        scroll_grabber.node.style.fill = scroll_grabber_color;
      },
      true
    );

    document.body.addEventListener(
      "mousemove",
      (evt) => {
        let grabber_moved_distance_signed = evt.clientY - last_scroll_y;
        if (scroll_grabber_pressed) {
          if (evt.clientY > last_scroll_y) {
            //Going down
            grabber_moved_distance_signed =
              get_scroll_grabber_top_relative_to_parent() +
                get_scroll_grabber_height() +
                grabber_moved_distance_signed >
              get_scroll_bar_length()
                ? get_scroll_bar_length() -
                  get_scroll_grabber_top_relative_to_parent() -
                  get_scroll_grabber_height()
                : grabber_moved_distance_signed;
            // update_rows_initial(get_visible_row_data())
            scroll_grabber.translate(0, grabber_moved_distance_signed);
            scroll(grabber_moved_distance_signed, "down");
          } else {
            grabber_moved_distance_signed =
              get_scroll_grabber_top_relative_to_parent() +
                grabber_moved_distance_signed <
              0
                ? -get_scroll_grabber_top_relative_to_parent()
                : grabber_moved_distance_signed;
            // update_rows_initial(get_visible_row_data())
            scroll_grabber.translate(0, grabber_moved_distance_signed);
            scroll(grabber_moved_distance_signed, "up");
          }
        }
        last_scroll_y = evt.clientY;
      },
      true
    );

    scroll_grabber.mouseover(() => {
      if (!scroll_grabber_pressed) {
        scroll_grabber.node.style.fill = scroll_grabber_hover;
      }
    });

    scroll_grabber.mouseout(() => {
      if (!scroll_grabber_pressed) {
        scroll_grabber.node.style.fill = scroll_grabber_color;
      }
    });
    scroll_bar.addClass("scroll-bar");
    scroll_grabber.addClass("scroll-grabber");
  }

  function update_horizontal_scrollbar() {
    
  }

  /**
   * Return start of invisible rows to end rendered
   */
  function get_buffered_rows_bottom_range() {
    // let range = get_visible_rows_range()
    // range.end = range.end + 1 > rows_drawn_range.end_index ?
    return { start: range.end + 1 };
  }

  function get_visible_rows_range(scroll_row_translation_y = 0) {
    const rows_translate_y = row_group
      ? row_group.transform().translateY + scroll_row_translation_y
      : 0;
    let _visible_start_index_rounded = -Math.round(
      rows_translate_y / data_cell_height
    );
    // _visible_start_index_rounded = _visible_start_index_rounded > (row_data.length - 1) - _visible_rows_rounded ? (row_data.length - 1) - _visible_rows_rounded : _visible_start_index_rounded
    const visible_row_start_index =
      _visible_start_index_rounded > -(rows_translate_y / data_cell_height)
        ? _visible_start_index_rounded - 1
        : _visible_start_index_rounded;
    const _visible_row_end_index =
      rows_translate_y == 0
        ? rows_visible - 1
        : visible_row_start_index + rows_visible;
    const visible_row_end_index =
      _visible_start_index_rounded < -(rows_translate_y / data_cell_height)
        ? _visible_row_end_index
        : _visible_row_end_index;

    return { start: visible_row_start_index, end: visible_row_end_index };
  }

  function get_visible_row_data(with_buffered) {
    const range = get_visible_rows_range();
    range.end = with_buffered ? range.end + buffered_rows : range.end;
    let filtered = row_data.slice(range.start, range.end + 1);
    return filtered;
  }

  function round(value, decimal_places) {
    return (
      Math.round((value + Number.EPSILON) * Math.pow(10, decimal_places)) /
      Math.pow(10, decimal_places)
    );
  }

  // function widen() {
  //   console.log(
  //     `Row TransY: ${
  //       row_group.transform().translateY
  //     } scroll_grabber rate: ${get_scrolled_percent()} grabber_top: ${get_scroll_grabber_top_relative_to_parent()} gHeight: ${get_scroll_grabber_height()} sbarHeight: ${get_scroll_bar_length()}`
  //   );
  //   console.log(scroll_grabber.node.getBoundingClientRect().top);
  //   console.log(
  //     "scrollable height: " +
  //       get_scrollable_height() +
  //       "= top = " +
  //       get_scroll_grabber_top_relative_to_parent()
  //   );
  //   get_visible_row_data(true);
  // }
  window.onresize = ()=>{
        // console.log('bad')
        // draw_header()
    }
</script>

<style lang="scss">
  .page-cont {
    background-color: cadetblue;
    height: 1000px;
  }

  .side-panel {
    background-color: darkslategrey;
    color: mintcream;
  }

  .content {
    background-color: mediumpurple;
    color: mintcream;
  }

  :global(.header-label) {
    fill: white;
    text-anchor: middle;
    /* Center  Vertivally */
    dominant-baseline: middle;
    text-overflow: ellipsis;
  }

  .header-label:hover {
    fill: red;
  }

  :global(.header-cell) {
    fill: #3857ca;
  }

  :global(.row-cell) {
    fill: white;
  }

  .svg-tbl-outer {
    /* width: auto; */
    // height: 100%;
    height: 450px; //400 + 35 + 15
    position: relative;
    // overflow-x: scroll;
  }

  .svg-table-header {
    /* Get below from client */
    height: 35px;
    overflow: hidden;
  }

  .svg-table-body {
    /* Calculate below from client */
    position: relative;
  }

  :global(.scroll-bar) {
    position: absolute;
    fill: white;
  }

  .svg-table-scroll-container {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    /* left: 1085px; */
    width: 15px;
  }
  .svg-table-horizontal-scroll-container {
    position: absolute;
    top: 400px;
    height: 15px;
    /* left: 1085px; */
    width: 100%;
  }
</style>

<div class="svg-tbl-outer" bind:this={table_outer_element}>
  <div class="svg-table-header" id="svg-table-header" />
  <div
    class="svg-table-body"
    id="svg-table-body"
    bind:this={table_body_element}>
    <div
      class="svg-table-scroll-container"
      bind:this={svgTableScrollContainer} />
  </div>
  <div
      class="svg-table-horizontal-scroll-container"
      bind:this={svgTableHorizontalScrollContainer} />
</div>
