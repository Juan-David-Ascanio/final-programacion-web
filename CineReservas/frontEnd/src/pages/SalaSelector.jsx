export default function SalaSelector({ selectedSala, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ marginRight: 10, fontSize: "18px" }}>
        Selecciona la sala:
      </label>

      <select
        value={selectedSala}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          padding: "8px 12px",
          fontSize: "16px",
          borderRadius: 5
        }}
      >
        <option value={1}>Sala 1</option>
        <option value={2}>Sala 2</option>
        <option value={3}>Sala 3</option>
        <option value={4}>Sala 4</option>
        <option value={5}>Sala 5</option>
      </select>
    </div>
  );
}
