import React, {Fragment} from "react";
import debug from "yellowbrick-debug";
import PropTypes from "prop-types";

const _logger = debug.extend("DocumentFileManager");

function DocumentFileManager(props) {
  const documents = props.docs;
  _logger("documents", documents);

  return (
    <Fragment>
      {documents.map((document, index) => (
        <tr key={index}>
          <td className="col-3 text-center bg-white">{document.name}</td>
          <td className="col-3 text-center bg-white">{document.type}</td>
          <td className="col-3 text-center bg-white">{document.dateCreated}</td>
        </tr>
      ))}
    </Fragment>
  );
}

export default DocumentFileManager;

DocumentFileManager.propTypes = {
  docs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      dateCreated: PropTypes.string,
    })
  ),
};
