import React from "react";

import * as NGL from "ngl";

import eventBus from "./EventBus";

import "./StructureVisualizer.css";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
class StructureVisualizer extends React.Component {
  constructor(props) {
    super(props);
    console.log("This is the structure visulizer event");
    console.log(this.props.aiidaAttributes.sites);

    var sites = this.props.aiidaAttributes.sites;

    var pdb = "MODEL     1\n";

    sites.map((r, i) => (
      pdb += "ATOM" + i.toString().padStart(7, ' ') + r.kind_name.padStart(5, ' ') +
      " MOL" + "1".padStart(6, ' ') + r.position[0].toFixed(3).toString().padStart(12, ' ')
      + r.position[1].toFixed(3).toString().padStart(8, ' ') + r.position[2].toFixed(3).toString().padStart(8, ' ')
      + "  1.00  0.00" + r.kind_name.padStart(12, ' ') + "\n"));

    pdb += "ENDMDL";

    console.log(pdb);

    this.pdb = new Blob([pdb], { type: 'text/plain' });

    window.requestAnimationFrame(() => {
      this.stage = new NGL.Stage("test-dou", { backgroundColor: 'white' });
      this.stage.loadFile(this.pdb, { ext: "pdb", name: 'structure1' }).then(function (comp) {
        comp.addRepresentation("ball+stick", { multipleBond: true });
        comp.autoView();
      });

      this.stage.viewer.container.addEventListener('dblclick', () => {
        this.stage.toggleFullscreen();
      });
    });
  }

  async componentDidMount() {
    eventBus.on("getAtomIndex", (data) => {
      console.log('Get message:', data.message);
      const i = data.message;
      this.stage.getComponentsByName('structure1').forEach((element: any) => {
        this.stage.removeComponent(element);
      });
      this.stage.loadFile(this.pdb, { ext: "pdb", name: 'structure1' }).then(function (comp) {
        comp.addRepresentation("ball+stick", { multipleBond: true, sele: "@" + i });
        comp.autoView();
      });

      sleep(1000).then(() => {
        this.stage.getComponentsByName('structure1').forEach((element: any) => {
          this.stage.removeComponent(element);
        });

        this.stage.loadFile(this.pdb, { ext: "pdb", name: 'structure1' }).then(function (comp) {
          comp.addRepresentation("ball+stick", { multipleBond: true });
          comp.autoView();
        });
      });
    });
  }

  componentWillUnmount() {
    eventBus.remove("getAtomIndex");
  }

  render() {
    return <div className="structure-visualizer" id="test-dou"></div>;
  }
}

export default StructureVisualizer;
