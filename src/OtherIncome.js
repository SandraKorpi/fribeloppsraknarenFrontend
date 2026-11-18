import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Form, ListGroup } from 'react-bootstrap';
import ApiService from './ApiService';

const TYPES = {
    CAPITAL: { label: 'Kapital', help: 'Ränta, utdelning, försäljning av aktier och fonder' },
    BUSINESS: { label: 'Eget företag', help: 'Inkomst av näringsverksamhet' },
    BENEFIT: { label: 'Ersättning', help: 'Sjukpenning, a-kassa, föräldrapenning' },
    OTHER: { label: 'Annat', help: 'Annan skattepliktig inkomst' },
};

const kr = (value) => `${Math.round(value).toLocaleString('sv-SE')} kr`;

const pad = (n) => String(n).padStart(2, '0');

// Första dagen i halvåret som visas, så att ett nytt datum hamnar rätt som standard.
const defaultDate = (year, semester) => {
    const today = new Date();
    const half = today.getMonth() < 6 ? 'VT' : 'HT';
    if (today.getFullYear() === year && half === semester) {
        return `${year}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    }
    return semester === 'VT' ? `${year}-01-01` : `${year}-07-01`;
};

const emptyForm = (year, semester) => ({
    id: null,
    date: defaultDate(year, semester),
    type: 'CAPITAL',
    amount: '',
    description: '',
    counted: true,
});

/**
 * Lista och formulär för övrig inkomst under ett kalenderhalvår.
 * onChanged anropas efter varje ändring så att fribeloppet kan räknas om.
 */
function OtherIncome({ year, semester, onChanged }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm(year, semester));
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);

    const load = useCallback(async () => {
        setError(null);
        try {
            setItems(await ApiService.getOtherIncome(year, semester));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [year, semester]);

    useEffect(() => {
        setLoading(true);
        setOpen(false);
        load();
    }, [load]);

    const startAdd = () => {
        setForm(emptyForm(year, semester));
        setFormError(null);
        setOpen(true);
    };

    const startEdit = (item) => {
        setForm({
            id: item.id,
            date: item.date,
            type: item.type,
            amount: String(item.amount),
            description: item.description || '',
            counted: item.counted,
        });
        setFormError(null);
        setOpen(true);
    };

    const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

    const handleSave = async (event) => {
        event.preventDefault();
        setFormError(null);

        const amount = Number(form.amount.replace(',', '.'));
        if (!form.date) {
            setFormError('Välj ett datum.');
            return;
        }
        if (!Number.isFinite(amount) || amount <= 0) {
            setFormError('Ange ett belopp större än noll.');
            return;
        }

        const payload = {
            date: form.date,
            type: form.type,
            amount,
            description: form.description.trim() || null,
            counted: form.counted,
        };

        setSaving(true);
        try {
            if (form.id) {
                await ApiService.updateOtherIncome(form.id, payload);
            } else {
                await ApiService.addOtherIncome(payload);
            }
            setOpen(false);
            await load();
            if (onChanged) onChanged();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm('Vill du radera den här inkomsten?')) return;
        setError(null);
        try {
            await ApiService.deleteOtherIncome(item.id);
            await load();
            if (onChanged) onChanged();
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleCounted = async (item) => {
        setError(null);
        try {
            await ApiService.updateOtherIncome(item.id, { ...item, counted: !item.counted });
            await load();
            if (onChanged) onChanged();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="other-income">
            <h5>Övrig inkomst</h5>
            <p className="fribelopp-help">
                Lägg till inkomst som inte är lön för timmarna ovan, till exempel avkastning, sjukpenning eller
                inkomst från eget företag. CSN räknar all skattepliktig inkomst mot fribeloppet. Ange beloppet
                före skatt.
            </p>

            {loading && <p className="text-muted">Laddar...</p>}
            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

            {!loading && items.length === 0 && !open && (
                <p className="text-muted">Inga övriga inkomster under det här halvåret.</p>
            )}

            {items.length > 0 && (
                <ListGroup className="mb-2">
                    {items.map((item) => (
                        <ListGroup.Item key={item.id} className="d-flex flex-column gap-1">
                            <div className="d-flex justify-content-between">
                                <span>
                                    <strong>{kr(item.amount)}</strong>{' '}
                                    <Badge bg="secondary">{TYPES[item.type].label}</Badge>
                                    {!item.counted && <Badge bg="warning" text="dark" className="ms-1">Räknas inte</Badge>}
                                </span>
                                <span className="text-muted">{item.date}</span>
                            </div>
                            {item.description && <span className="text-muted">{item.description}</span>}
                            <div className="d-flex gap-2">
                                <Button size="sm" variant="outline-secondary" onClick={() => startEdit(item)}>Ändra</Button>
                                <Button size="sm" variant="outline-secondary" onClick={() => toggleCounted(item)}>
                                    {item.counted ? 'Räkna inte med' : 'Räkna med'}
                                </Button>
                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item)}>Radera</Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            {open ? (
                <Form onSubmit={handleSave} className="fribelopp-form" noValidate>
                    <Form.Group controlId="other-income-date" className="mb-2">
                        <Form.Label>Datum</Form.Label>
                        <Form.Control
                            type="date"
                            value={form.date}
                            min={semester === 'VT' ? `${year}-01-01` : `${year}-07-01`}
                            max={semester === 'VT' ? `${year}-06-30` : `${year}-12-31`}
                            onChange={(e) => setField('date', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="other-income-type" className="mb-2">
                        <Form.Label>Typ</Form.Label>
                        <Form.Select value={form.type} onChange={(e) => setField('type', e.target.value)}>
                            {Object.entries(TYPES).map(([value, t]) => (
                                <option key={value} value={value}>{t.label}</option>
                            ))}
                        </Form.Select>
                        <Form.Text muted>{TYPES[form.type].help}</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="other-income-amount" className="mb-2">
                        <Form.Label>Belopp före skatt (kr)</Form.Label>
                        <Form.Control
                            type="text"
                            inputMode="decimal"
                            value={form.amount}
                            onChange={(e) => setField('amount', e.target.value)}
                        />
                        {form.type === 'CAPITAL' && (
                            <Form.Text muted>
                                Vid försäljning av aktier eller fonder är det vinsten efter eventuella förluster som räknas.
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group controlId="other-income-description" className="mb-2">
                        <Form.Label>Anteckning (valfri)</Form.Label>
                        <Form.Control
                            type="text"
                            maxLength={100}
                            value={form.description}
                            onChange={(e) => setField('description', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Check
                        id="other-income-counted"
                        type="checkbox"
                        className="mb-3"
                        label="Räkna med i fribeloppet"
                        checked={form.counted}
                        onChange={(e) => setField('counted', e.target.checked)}
                    />

                    {formError && <Alert variant="danger" className="py-2">{formError}</Alert>}

                    <div className="d-flex gap-2">
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? 'Sparar...' : 'Spara'}
                        </Button>
                        <Button variant="secondary" disabled={saving} onClick={() => setOpen(false)}>Avbryt</Button>
                    </div>
                </Form>
            ) : (
                <Button variant="outline-primary" size="sm" onClick={startAdd}>Lägg till övrig inkomst</Button>
            )}
        </div>
    );
}

export default OtherIncome;
