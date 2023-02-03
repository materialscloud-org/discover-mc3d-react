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

      // create tooltip element and add to the viewer canvas
      var tooltip = document.createElement("div");
      Object.assign(tooltip.style, {
        display: "none",
        position: "absolute",
        zIndex: 10,
        pointerEvents: "none",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "lightgrey",
        padding: "0.5em",
        fontFamily: "sans-serif"
      });

      this.stage.viewer.container.appendChild(tooltip);

      this.stage.signals.hovered.add(function (pickingProxy) {
        if (pickingProxy && pickingProxy.atom) {
          var atom = pickingProxy.atom;
          eventBus.dispatch("hoverAtom", { message: atom['index'] });
        };

        if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
          var atom = pickingProxy.atom || pickingProxy.closestBondAtom;
          var cp = pickingProxy.canvasPosition;
          tooltip.innerText = "Dou: " + atom.qualifiedName();
          tooltip.style.bottom = cp.y + 3 + "px";
          tooltip.style.left = cp.x + 3 + "px";
          tooltip.style.display = "block";
        } else {
          tooltip.style.display = "none";
        }
      });
    });
  }

  componentDidMount() {
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

      sleep(500).then(() => {
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
