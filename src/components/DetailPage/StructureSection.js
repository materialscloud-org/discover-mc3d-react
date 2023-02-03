import React from "react";

import Table from "react-bootstrap/Table";

import "./StructureSection.css";

import eventBus from "./EventBus";

class StructureSection extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.aiidaAttributes);
  }

  state = {
    selectedRow: -1
  }

  getAtomIndex = selectedRow => e => {
    const index = e.target.parentNode.getAttribute('data-item');
    console.log('This index of the atom is:', index);
    if (selectedRow !== undefined) {
      this.setState({ selectedRow });
    };
    eventBus.dispatch("getAtomIndex", { message: index });
  }

  componentDidMount() {
    eventBus.on("hoverAtom", (data) => {
      console.log('Get message:', data.message);
      const i = data.message;
      this.setState({ selectedRow: i });
      });
  }

  componentWillUnmount() {
    eventBus.remove("hoverAtom");
  }

  render() {
    let nDig = 4;
    return (
      <div className="structure-section">
        <b>Structural information</b>
        <div className="structure-section-inner">
          <div>
            <p>Cell</p>
            <Table bordered striped size="sm">
              <thead>
                <tr>
                  <th></th>
                  <th>x [Å]</th>
                  <th>y [Å]</th>
                  <th>z [Å]</th>
                </tr>
              </thead>
              <tbody>
                {this.props.aiidaAttributes.cell.map((v, i) => (
                  <tr key={i}>
                    <td>{"v" + (i + 1)}</td>
                    <td>{v[0].toFixed(nDig)}</td>
                    <td>{v[1].toFixed(nDig)}</td>
                    <td>{v[2].toFixed(nDig)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div>
            <p>Atomic positions</p>
            <Table bordered striped size="sm">
              <thead>
                <tr>
                  <th>Kind label</th>
                  <th>x [Å]</th>
                  <th>y [Å]</th>
                  <th>z [Å]</th>
                </tr>
              </thead>
              <tbody className="tableHover">
                {this.props.aiidaAttributes.sites.map((r, i) => (
                  <tr key={i} data-item={i} onClick={this.getAtomIndex(i)} className={this.state.selectedRow === i ? "tableSelected" : ""}>
                    <td>{r.kind_name}</td>
                    <td>{r.position[0].toFixed(nDig)}</td>
                    <td>{r.position[1].toFixed(nDig)}</td>
                    <td>{r.position[2].toFixed(nDig)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default StructureSection;
