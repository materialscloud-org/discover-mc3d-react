
import React from 'react';

import "./XrdSection.css"

class XrdSection extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        return (
          <div className="xrd-section">
            <b>Simulated X-Ray diffraction pattern</b>
          </div>
        )
    }
}

export default XrdSection;
