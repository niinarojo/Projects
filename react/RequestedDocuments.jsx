import {React, useState, useEffect, Fragment} from "react";
import {Form, Formik, Field, ErrorMessage} from "formik";
import requiredDocumentsService from "services/requiredDocumentsService";
import submitRequestedDocumentsService from "services/submitRequestedDocumentsService";
import SingleFileUpload from "components/fileupload/SingleFileUpload";
import PropTypes from "prop-types";
import requiredDocsSchemas from "schemas/requiredDocumentsSchema";
import DocumentFileManager from "./DocumentFileManager";
import toastr from "toastr";
import {useParams} from "react-router-dom";


function RequestedDocuments() {
  const [formData] = useState({
    requiredDocuments: "",
    fileId: "",
    document: "",
  });

  const [uploadedDocuments, setUploadedDocuments] = useState({
    uploadedDocuments: [],
    mappedUploadedDocuments: [],
  });

  const {id} = useParams();

  const [requiredDocuments, setRequiredDocuments] = useState({
    requiredDocuments: [formData],
    mappedDocuments: [],
    clientId: id,
  });
  _logger(requiredDocuments);

  _logger("id", id);

  const getUploadedDocuments = () => {
    submitRequestedDocumentsService
      .getAll(id)
      .then(onGetUploadedDocumentsSuccess)
      .catch(onGetUploadedDocumentsError);
  };

  useEffect(() => {
    requiredDocumentsService
      .get(requiredDocuments.clientId)
      .then(requiredDocumentsSuccess)
      .catch(requiredDocumentsError);

    getUploadedDocuments();
  }, []);

  function requiredDocumentsSuccess(response) {
    let requiredDocuments = response.items;

    _logger(requiredDocuments);

    setRequiredDocuments((prevState) => {
      const documents = {...prevState};
      document.requiredDocuments = requiredDocuments;
      documents.mappedDocuments = requiredDocuments.map(mapRequiredDocuments);
      return documents;
    });
  }

  const requiredDocumentsError = (err) => {
    _logger(err);
  };
  const mapRequiredDocuments = (items) => (
    <option key={items.id} value={items.id}>
      {items.requiredDocumentTypes.name}
    </option>
  );
  const handleUpload = (response, setFieldValue) => {
    _logger("From handler:", response);
    setFieldValue("document", response.item[0].url);
    setFieldValue("fileId", response.item[0].id);
  };

  const handleSubmit = (values) => {
    const documentId = values.requiredDocuments;
    const fileId = values.fileId;
    const payload = {
      requiredDocumentsId: documentId,
      filedId: fileId,
    };

    submitRequestedDocumentsService
      .addDocument(payload)
      .then(onAddRequestedDocumentsSuccess)
      .catch(onAddRequestedDocumentsError);

    getUploadedDocuments();
  };

  const onAddRequestedDocumentsSuccess = (response) => {
    _logger("onAddRequestedDocumentsSuccess success", response);
    toastr.success("Document added");
  };

  const onGetUploadedDocumentsSuccess = (response) => {
    _logger("onGetUploadedDocumentsSuccess success", response);
    setUploadedDocuments((prevState) => {
      const clone = {...prevState};
      clone.uploadedDocuments = response.item;
      clone.mappedUploadedDocuments = response.item.map(mapUploadedDocuments);
      return clone;
    });
  };

  const mapUploadedDocuments = (document) => {
    _logger("mapdocs", document);
    var newDocument = {
      name: document.requiredDocumentTypes.name,
      type: document.fileModel.name,
      dateCreated: document.fileModel.dateCreated,
    };
    return newDocument;
  };

  const onAddRequestedDocumentsError = (error) => {
    _logger("onAddRequestedDocumentsError", error);
  };

  const onGetUploadedDocumentsError = (error) => {
    _logger("onGetUploadedDocumentsError", error);
  };

  return (
    <Fragment>
      <div>
        <h1>Requested Documents</h1>
      </div>
      <Formik
        initialValues={formData}
        enableReinitialize={true}
        validationSchema={requiredDocsSchemas.requestedDocSchemas}
        onSubmit={handleSubmit}>
        {({setFieldValue}) => (
          <Form>
            <div className="card">
              <div className="card-body bg-white">
                <div className="form-group">
                  <Field
                    component="select"
                    name="requiredDocuments"
                    className="form-control"
                    id="formDocumentType">
                    <option value="">Select document to upload</option>
                    {requiredDocuments.mappedDocuments}
                  </Field>
                  <ErrorMessage name="requiredDocuments" component="div" className="text-danger" />
                </div>
                <div className="forg-group mt-3">
                  <SingleFileUpload
                    name="fileId"
                    handleUpload={(response) => handleUpload(response, setFieldValue)}
                  />
                  <ErrorMessage name="fileId" component="div" className="text-danger" />
                </div>
                <div className="col-xs-12">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <h2 className="mt-8 mb-3">Uploaded Documents</h2>
      <table
        role="table"
        className="text-nowrap table text-center align-middle table-light maintain-cursor">
        <thead className="table-primary">
          <tr>
            <th className="align-middle text-center pe-3 ps-3" scope="col">
              NAME
            </th>
            <th className="align-middle text-center pe-3 ps-3" scope="col">
              TYPE
            </th>
            <th className="align-middle text-center pe-3 ps-3" scope="col">
              DATE CREATED
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {" "}
          <DocumentFileManager docs={uploadedDocuments.mappedUploadedDocuments} />
        </tbody>
      </table>
    </Fragment>
  );
}
RequestedDocuments.propTypes = {
  clientId: PropTypes.string,
  requiredDocumentTypeId: PropTypes.number,
};
export default RequestedDocuments;
