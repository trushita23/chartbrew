import React from "react";
import PropTypes from "prop-types";
import {
  Header, Popup, Checkbox, Label, Grid,
} from "semantic-ui-react";
import { SketchPicker } from "react-color";

import { primary, chartColors } from "../../../config/colors";

function DatasetAppearance(props) {
  const {
    chart, dataItems, onUpdate, dataset,
  } = props;

  const _renderColorPicker = (type, fillIndex) => {
    let color = type === "dataset" ? dataset.datasetColor
      : (fillIndex || fillIndex === 0)
        ? dataset.fillColor[fillIndex] : dataset.fillColor;

    if (!dataset.datasetColor && type === "dataset") {
      color = chartColors[Math.floor(Math.random() * chartColors.length)];
    }

    return (
      <SketchPicker
        color={color}
        onChangeComplete={(color) => {
          const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;

          if (type === "dataset") {
            onUpdate({ ...dataset, datasetColor: rgba });
          }

          if (type === "fill") {
            if (!fillIndex && fillIndex !== 0) {
              onUpdate({ ...dataset, fillColor: rgba });
            } else {
              const { fillColor } = dataset;
              if (Array.isArray(fillColor) && fillColor[fillIndex]) {
                fillColor[fillIndex] = rgba;
              }
              onUpdate({ ...dataset, fillColor }, true);
            }
          }
        }}
      />
    );
  };

  return (
    <Grid columns={2}>
      <Grid.Column width={8}>
        <Header size="tiny">Dataset Color</Header>
        <Popup
          content={() => _renderColorPicker("dataset")}
          trigger={(
            <Label
              size="large"
              color="blue"
              style={styles.datasetColorBtn(dataset.datasetColor)}
              content="Click to select"
            />
          )}
          style={{ padding: 0, margin: 0 }}
          on="click"
          offset="0, 10px"
          position="right center"
        />
      </Grid.Column>

      <Grid.Column width={8}>
        <Header size="tiny">Fill Color</Header>
        {chart.type !== "line" && (
          <div style={{ paddingBottom: 10 }}>
            <Checkbox
              checked={dataset.multiFill || false}
              onChange={(e, data) => {
                onUpdate({ ...dataset, multiFill: data.checked });
              }}
              label="Multiple colors"
            />
          </div>
        )}
        <div>
          {(!dataset.multiFill || chart.type === "line") && (
          <>
            <Popup
              content={() => _renderColorPicker("fill")}
              trigger={(
                <Label
                  size="large"
                  color="blue"
                  style={styles.datasetColorBtn(dataset.fillColor)}
                  content="Click to select"
                />
              )}
              style={{ padding: 0, margin: 0 }}
              on="click"
              offset="0, 10px"
              position="right center"
            />
            <Checkbox
              checked={dataset.fill || false}
              onChange={(e, data) => {
                onUpdate({ ...dataset, fill: data.checked });
              }}
              style={{ verticalAlign: "middle", marginLeft: 10 }}
            />
          </>
          )}
          {dataset.multiFill && chart.type !== "line" && (
          <Label.Group>
            {dataItems && dataItems.data && dataItems.data.map((val, fillIndex) => {
              return (
                <Popup
                  key={dataItems.labels[fillIndex]}
                  content={() => _renderColorPicker("fill", fillIndex)}
                  trigger={(
                    <Label
                      size="large"
                      color="blue"
                      style={styles.datasetColorBtn(dataset.fillColor[fillIndex])}
                      content={dataItems.labels[fillIndex]}
                    />
                  )}
                  style={{ padding: 0, margin: 0 }}
                  on="click"
                  offset="0, 10px"
                  position="right center"
                />
              );
            })}
          </Label.Group>
          )}
        </div>
      </Grid.Column>
    </Grid>
  );
}

const styles = {
  datasetColorBtn: (datasetColor) => ({
    cursor: "pointer",
    backgroundColor: datasetColor === "rgba(0,0,0,0)" ? primary : datasetColor,
    border: `1px solid ${primary}`
  }),
};

DatasetAppearance.propTypes = {
  dataset: PropTypes.object.isRequired,
  chart: PropTypes.object.isRequired,
  dataItems: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default DatasetAppearance;
