## Example Dataset

Materials cloud uses css styling to make markdown follow the materialscloud theme. This allows contributors to write simple markdown and it be rendered live. For details on markdown syntax see the [markdown docs](https://www.markdownguide.org/basic-syntax/).

The following markdown plugins are installed:

- remarkMath
- rehypeKatex
- remarkGfm
- remarkFootnotes

This allows LaTex style block math equations:

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_{0}}
$$

That can be inline: $\nabla \cdot E$

We also allow intext citaions (that will autohop to the in page reference.):

This is some text with a citation[^1] and another[^2].

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet a turpis eget commodo. Vestibulum a tellus vitae diam egestas egestas id non est. Cras interdum odio sed erat sollicitudin rhoncus. Aliquam non eros sit amet dolor volutpat blandit non ac enim. Sed ut dolor porttitor mauris lacinia molestie. Sed at felis enim. Nam placerat dui non consequat tincidunt. Nunc quis sapien dui. In pharetra nunc ut imperdiet viverra. In eu erat in sem venenatis eleifend nec at metus. Donec sit amet neque eleifend, condimentum tortor a, interdum dui. Mauris non elit non lorem dignissim egestas eget malesuada ex. Nullam quis tempor ante, in scelerisque velit. Duis in lectus bibendum, pharetra urna eget, tempus diam. Donec velit diam, sagittis eu porttitor ultricies, vehicula vitae sem. Vestibulum porta felis velit, quis vehicula nibh maximus eu.

Nam dui quam, gravida tristique placerat ac, mollis nec urna. Praesent pretium blandit ante ac finibus. Pellentesque vulputate massa ac lobortis condimentum. In in purus justo. Proin lacinia nibh id molestie tristique. Ut non libero pretium, tincidunt dolor ut, tempus tortor. Curabitur ullamcorper accumsan sem, eget fermentum sapien vehicula sit amet. Curabitur in leo non est cursus porta sed sit amet augue. Etiam pharetra lectus ac lobortis elementum. Etiam rutrum mollis eros, tempor egestas libero auctor vitae. Nam suscipit nisl eget libero viverra aliquet. Pellentesque malesuada, nulla eget mollis suscipit, velit nibh interdum orci, non ultrices est lacus vitae est. Duis lobortis rutrum odio sed rhoncus. Nunc dapibus vitae elit tempor laoreet. Praesent eu justo a felis bibendum auctor nec non mi. Vivamus efficitur auctor mauris, id dictum augue ornare at.

[^1]: Talirz, L., Kumbhar, S., Passaro, E. _et al._ Materials Cloud, a platform for open computational science. Sci Data **7**, 299 (2020). https://doi.org/10.1038/s41597-020-00637-5

[^2]: Citation here.
