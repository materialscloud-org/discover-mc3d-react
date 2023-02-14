
import React from 'react';

import "./SelectionSection.css"

class SelectionSection extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        return (
          <div className="selection-section">
            <b>Similar structures</b>
            <p>Crystals with the same chemical composition</p>
          </div>
        )
    }
}

export default SelectionSection;
