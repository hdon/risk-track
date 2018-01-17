import React from 'react';
import {
  LineChart
, Line
, CartesianGrid
, XAxis
, YAxis
, Tooltip
, ResponsiveContainer
} from 'recharts';
import {
  PageHeader
} from 'react-bootstrap';
import * as _ from 'lodash';

const colors = [
  'hsl(  0, 50%, 50%)'
, 'hsl( 60, 50%, 50%)'
, 'hsl(120, 50%, 50%)'
, 'hsl(180, 50%, 50%)'
, 'hsl(240, 50%, 50%)'
, 'hsl(320, 50%, 50%)'
];

export default ({players, minSpawnRate}) => {
  const data = _.map(_.range(8), x => {
    var rval = { x };
    _.each(players, p =>
      rval[p.name] = 
        p.power + x * Math.max(Math.floor(p.land/3) + p.bonus, minSpawnRate)
    );
    return rval;
  });

  return <div>
    <PageHeader>
      Troop Power Projection
    </PageHeader>
    <div style={{height:'60vh'}}>
      <ResponsiveContainer>
        <LineChart
          data={data}
        >
          <XAxis type="number" dataKey="x"/>
          <YAxis type="number"/>
          <CartesianGrid stroke="silver"/>
          <Tooltip/>
          {
            players.map((p, i) =>
              <Line
                key={i}
                type="monotone"
                dataKey={p.name}
                stroke={colors[i]}
              />
            )
          }
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
}
