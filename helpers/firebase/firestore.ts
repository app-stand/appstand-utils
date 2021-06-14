export function unwrapQuerySnapshot(snapshot: any) {
  const items = [];
  for (const doc of snapshot.docs) {
    items.push(doc.data());
  }
  return items ? items : [];
}
