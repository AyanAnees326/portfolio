"""Rewrite a PDF without application, author, or machine metadata."""

from pathlib import Path
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject

source = Path(__file__).resolve().parents[1] / "public" / "Ayan-Anees-Resume.pdf"
temporary = source.with_suffix(".scrubbed.pdf")
reader = PdfReader(source)
writer = PdfWriter()
writer.clone_document_from_reader(reader)
writer.root_object.pop(NameObject("/Metadata"), None)
if writer._info is not None:
    writer._info.get_object().clear()
writer.add_metadata({
    "/Title": "Ayan Anees - Resume",
    "/Author": "",
    "/Creator": "",
    "/Producer": "",
    "/Subject": "",
    "/Keywords": "",
})
with temporary.open("wb") as stream:
    writer.write(stream)
temporary.replace(source)
print(source)
