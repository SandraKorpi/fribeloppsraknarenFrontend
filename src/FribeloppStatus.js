import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Form, ProgressBar, Spinner } from 'react-bootstrap';
import ApiService from './ApiService';
import './FribeloppStatus.css';

const MONTH_NAMES = [
    'januari', 'februari', 'mars', 'april', 'maj', 'juni',
    'juli', 'augusti', 'september', 'oktober', 'november', 'december',
];

const STUDY_RATES = [100, 75, 50];

const kr = (value) => `${Math.round(value).toLocaleString('sv-SE')} kr`;

// Fribeloppet gäller per kalenderhalvår: januari till juni (VT) och juli till december (HT).
const semesterOf = (month) => (month <= 6 ? 'VT' : 'HT');
const semesterLabel = (semester, year) =>
    semester === 'VT'
        ? `${MONTH_NAMES[0]} till ${MONTH_NAMES[5]} ${year}`
        : `${MONTH_NAMES[6]} till ${MONTH_NAMES[11]} ${year}`;

const SOURCE_TEXT = {
    OWN_VALUE: 'Fribeloppet är det värde du angav från ditt CSN-beslut.',
    CSN_TABLE: 'Fribeloppet kommer från CSN:s tabell för antal veckor och studietakt.',
    ESTIMATED: 'Fribeloppet är uppskattat utifrån prisbasbeloppet. Kontrollera mot ditt beslut från CSN.',
};

/**
 * Visar var användaren står i förhållande till fribeloppet för halvåret som kalendern visar,
 * och låter hen ange antal studieveckor och studietakt, som fribeloppet beror på.
 *
 * Props: year och month (1-12) för månaden i kalendern, och refreshKey som ändras
 * när timmar har lagts till, ändrats eller tagits bort.
 */
function FribeloppStatus({ year, month, refreshKey }) {
    const semester = semesterOf(month);

    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [editing, setEditing] = useState(false);
    const [weeks, setWeeks] = useState('');
    const [studyRate, setStudyRate] = useState(100);
    const [useOwnValue, setUseOwnValue] = useState(false);
    const [ownValue, setOwnValue] = useState('');
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);

    const fillForm = useCallback((data) => {
        setWeeks(data.weeks ? String(data.weeks) : '');
        setStudyRate(data.studyRate || 100);
        const own = data.fribeloppSource === 'OWN_VALUE';
        setUseOwnValue(own);
        setOwnValue(own && data.fribelopp != null ? String(data.fribelopp) : '');
    }, []);

    useEffect(() => {
        let cancelled = false; // Om användaren bläddrar snabbt ska ett gammalt svar inte skriva över ett nyare.

        setLoading(true);
        setLoadError(null);
        setFormError(null);

        ApiService.getFribeloppStatus(year, semester)
            .then((data) => {
                if (cancelled) return;
                setStatus(data);
                fillForm(data);
                setEditing(!data.configured);
            })
            .catch((error) => {
                if (cancelled) return;
                setStatus(null);
                setLoadError(error.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [year, semester, refreshKey, fillForm]);

    const handleSave = async (event) => {
        event.preventDefault();
        setFormError(null);

        const weeksNumber = Number(weeks);
        if (!Number.isInteger(weeksNumber) || weeksNumber < 1 || weeksNumber > 26) {
            setFormError('Antal veckor måste vara ett heltal mellan 1 och 26.');
            return;
        }

        let fribeloppOverride = null;
        if (useOwnValue) {
            fribeloppOverride = Number(ownValue);
            if (ownValue === '' || !Number.isFinite(fribeloppOverride) || fribeloppOverride < 0) {
                setFormError('Ange fribeloppet som ett positivt belopp i kronor.');
                return;
            }
        }

        setSaving(true);
        try {
            await ApiService.saveStudyPeriod(year, semester, {
                weeks: weeksNumber,
                studyRate: Number(studyRate),
                fribeloppOverride,
            });
            const fresh = await ApiService.getFribeloppStatus(year, semester);
            setStatus(fresh);
            fillForm(fresh);
            setEditing(false);
        } catch (error) {
            setFormError(error.message);
        } finally {
            setSaving(false);
        }
    };

    const renderForm = () => (
        <Form onSubmit={handleSave} className="fribelopp-form" noValidate>
            <p className="fribelopp-help">
                Fribeloppet beror på hur många veckor du har studiemedel under halvåret och hur stor del av
                heltid du studerar. Båda uppgifterna står i ditt beslut från CSN.
            </p>

            <Form.Group controlId="fribelopp-weeks" className="mb-3">
                <Form.Label>Antal veckor med studiemedel (1 till 26)</Form.Label>
                <Form.Control
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="26"
                    step="1"
                    value={weeks}
                    onChange={(e) => setWeeks(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="fribelopp-rate" className="mb-3">
                <Form.Label>Studietakt</Form.Label>
                <Form.Select value={studyRate} onChange={(e) => setStudyRate(e.target.value)}>
                    {STUDY_RATES.map((rate) => (
                        <option key={rate} value={rate}>{rate} procent</option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Check
                type="checkbox"
                id="fribelopp-own"
                className="mb-2"
                label="Jag vill ange fribeloppet från mitt CSN-beslut själv"
                checked={useOwnValue}
                onChange={(e) => setUseOwnValue(e.target.checked)}
            />
            {useOwnValue && (
                <Form.Group controlId="fribelopp-own-value" className="mb-3">
                    <Form.Label>Fribelopp för halvåret (kr)</Form.Label>
                    <Form.Control
                        type="number"
                        inputMode="numeric"
                        min="0"
                        step="1"
                        value={ownValue}
                        onChange={(e) => setOwnValue(e.target.value)}
                    />
                </Form.Group>
            )}

            {formError && <Alert variant="danger" className="py-2">{formError}</Alert>}

            <div className="d-flex gap-2">
                <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? 'Sparar...' : 'Spara'}
                </Button>
                {status && status.configured && (
                    <Button variant="secondary" disabled={saving} onClick={() => { fillForm(status); setFormError(null); setEditing(false); }}>
                        Avbryt
                    </Button>
                )}
            </div>
        </Form>
    );

    const renderStatus = () => {
        const percent = status.fribelopp > 0 ? Math.min(100, Math.round((status.income / status.fribelopp) * 100)) : 100;
        let variant = 'success';
        if (status.exceeded) variant = 'danger';
        else if (percent >= 80) variant = 'warning';

        return (
            <>
                <ProgressBar
                    now={percent}
                    variant={variant}
                    label={`${percent}%`}
                    aria-label="Hur stor del av fribeloppet du har använt"
                    className="mb-2"
                />
                <p className="mb-1">Inkomst hittills: <strong>{kr(status.income)}</strong></p>
                <p className="mb-1">
                    Fribelopp: <strong>{kr(status.fribelopp)}</strong>{' '}
                    <span className="text-muted">({status.weeks} veckor, {status.studyRate} procent)</span>
                </p>

                {status.exceeded ? (
                    <Alert variant="danger" className="py-2 mt-2 mb-2">
                        Du ligger <strong>{kr(status.over)}</strong> över fribeloppet. Ditt studiemedel kan minska
                        med ungefär <strong>{kr(status.estimatedReduction)}</strong>.
                    </Alert>
                ) : (
                    <p className="mb-1">
                        Kvar att tjäna: <strong>{kr(status.remaining)}</strong>
                        {status.extraHours > 0 && (
                            <span className="text-muted">
                                {' '}(cirka {status.extraHours.toLocaleString('sv-SE')} timmar till med din snittlön på {kr(status.averageHourlyPay)} i timmen)
                            </span>
                        )}
                    </p>
                )}

                <p className="fribelopp-note">{SOURCE_TEXT[status.fribeloppSource]}</p>

                <Button variant="outline-secondary" size="sm" onClick={() => setEditing(true)}>
                    Ändra veckor och studietakt
                </Button>
            </>
        );
    };

    return (
        <section className="fribelopp-status" aria-live="polite">
            <h4>Fribelopp {semesterLabel(semester, year)}</h4>

            {loading && (
                <p><Spinner animation="border" size="sm" role="status" /> Laddar...</p>
            )}

            {!loading && loadError && <Alert variant="danger" className="py-2">{loadError}</Alert>}

            {!loading && !loadError && status && (
                <>
                    {!status.configured && (
                        <p className="mb-2">Inkomst hittills: <strong>{kr(status.income)}</strong></p>
                    )}
                    {editing ? renderForm() : status.configured && renderStatus()}
                </>
            )}

            <p className="fribelopp-note mt-3 mb-0">
                Siffran baseras bara på lön från timmarna du registrerat här, före skatt och inklusive
                semesterersättning. CSN räknar all skattepliktig inkomst mot fribeloppet, även
                näringsverksamhet och kapital som ränta, utdelning och försäljning av aktier eller fonder,
                samt ersättningar som sjukpenning, a-kassa och föräldrapenning. Har du sådan inkomst
                ligger du närmare gränsen än siffran visar. Beräkningen är en uppskattning och CSN:s
                beslut gäller. Appen är inte gjord av CSN.
            </p>
        </section>
    );
}

export default FribeloppStatus;
