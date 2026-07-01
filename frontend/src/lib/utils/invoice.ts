function ns(val: any): string {
    if (val === null || val === undefined) return "";
    if (typeof val === "object" && "String" in val) {
        return val.Valid ? val.String : "";
    }
    if (typeof val === "string") return val;
    return String(val);
}

export function generateInvoicePDF(booking: any) {
    if (!booking) return;

    // ─── Parse JSON details safely ───
    const parseJson = (details: any) => {
        if (!details) return null;
        if (typeof details === "string") {
            try { return JSON.parse(details); } catch { return null; }
        }
        return details;
    };

    // ─── Payer / Candidate Info (from personal_details JSON) ───
    const rawPersonal = parseJson(booking.personal_details);
    let payerName = "";
    let payerEmail = "";
    let payerPhone = "";
    let payerAddress = "";
    let payerPostal = "";
    let payerCountry = "";
    let candidateName = "";

    if (rawPersonal) {
        // Payer info
        if (rawPersonal.payer) {
            const p = rawPersonal.payer;
            const fName = p.firstName || p.first_name || "";
            const lName = p.lastName || p.last_name || "";
            payerName = `${fName} ${lName}`.trim();
            payerEmail = p.email || "";
            payerPhone = p.phone || "";
            payerAddress = p.address || "";
            payerPostal = p.postalCode || p.postcode || p.postal_code || "";
            payerCountry = p.country || "";
        } else {
            // Flat structure
            const fName = rawPersonal.first_name || rawPersonal.firstName || "";
            const lName = rawPersonal.last_name || rawPersonal.lastName || "";
            payerName = `${fName} ${lName}`.trim();
            payerEmail = rawPersonal.email || "";
            payerPhone = rawPersonal.phone || "";
            payerAddress = rawPersonal.address_line1 || rawPersonal.addressLine1 || rawPersonal.address || "";
            payerPostal = rawPersonal.postcode || rawPersonal.postalCode || rawPersonal.postal_code || "";
            payerCountry = rawPersonal.country || "";
        }

        // Candidate info (if different from payer)
        if (rawPersonal.candidate) {
            const c = rawPersonal.candidate;
            const cFirst = c.firstName || c.first_name || "";
            const cLast = c.lastName || c.last_name || "";
            candidateName = `${cFirst} ${cLast}`.trim();
        }
    }

    // ─── Company Details (from company_details JSON) ───
    const rawCompany = parseJson(booking.company_details);
    let companyName = "";
    let companyReg = "";
    let companyAddress = "";
    let companyVat = "";
    if (rawCompany) {
        companyName = rawCompany.companyName || rawCompany.company_name || "";
        companyReg = rawCompany.companyReg || rawCompany.company_reg || "";
        companyAddress = rawCompany.companyAddress || rawCompany.company_address || "";
        companyVat = rawCompany.companyVat || rawCompany.company_vat || "";
    }

    // ─── Payment data (from booking.payment DB record) ───
    const payment = booking.payment || null;

    // Detect payment provider from DB fields
    let paymentProvider = "N/A";
    let transactionId = "";
    if (payment) {
        const paypalOrderId = ns(payment.paypal_order_id);
        const paypalCaptureId = ns(payment.paypal_capture_id);
        const stripeIntentId = ns(payment.stripe_payment_intent_id);
        const stripeChargeId = ns(payment.stripe_charge_id);
        const dbMethod = ns(payment.payment_method);

        if (paypalOrderId || paypalCaptureId) {
            paymentProvider = "PayPal";
            transactionId = paypalCaptureId || paypalOrderId;
        } else if (stripeIntentId || stripeChargeId) {
            paymentProvider = "Stripe";
            transactionId = stripeChargeId || stripeIntentId;
        } else if (dbMethod) {
            paymentProvider = dbMethod;
        }
    }

    // Payment status from DB
    const paymentStatus = payment ? payment.status : "no_payment";
    const isPaid = paymentStatus === "succeeded" || booking.status === "confirmed" || booking.status === "completed";

    // Payment number from DB
    const paymentNumber = payment ? payment.payment_number : "";

    // Card details from DB
    const cardBrand = payment ? ns(payment.card_brand) : "";
    const cardLast4 = payment ? ns(payment.card_last4) : "";
    const cardExpMonth = payment?.card_exp_month;
    const cardExpYear = payment?.card_exp_year;

    // Refund info from DB
    const refundedAmount = payment ? payment.refunded_amount : 0;
    const refundReason = payment ? ns(payment.refund_reason) : "";
    const refundedAt = payment?.refunded_at;

    // Receipt URL from DB
    const receiptUrl = payment ? ns(payment.receipt_url) : "";

    // Payment date from DB
    const paymentDate = payment ? new Date(payment.created_at).toLocaleDateString("en-GB", {
        day: "2-digit", month: "long", year: "numeric"
    }) : "";

    // ─── Currency formatting ───
    const formatPrice = (amount: number, currencyCode: string = "GBP") => {
        const symbol = currencyCode.toUpperCase() === "GBP" ? "£" : currencyCode.toUpperCase() === "EUR" ? "€" : "$";
        return `${symbol}${Number(amount || 0).toFixed(2)}`;
    };

    // ─── Dates from DB ───
    const invoiceDate = new Date(booking.created_at).toLocaleDateString("en-GB", {
        day: "2-digit", month: "long", year: "numeric"
    });
    const confirmedAt = booking.confirmed_at ? new Date(booking.confirmed_at).toLocaleDateString("en-GB", {
        day: "2-digit", month: "long", year: "numeric"
    }) : "";

    // ─── Totals from DB ───
    const totalAmount = Number(booking.total_amount || 0);
    const discountAmount = Number(booking.discount_amount || 0);
    const taxAmount = Number(booking.tax_amount || 0);
    const subtotal = totalAmount / 1.2;
    const vat = subtotal * 0.2;

    // ─── Booking type label ───
    const bookingTypeLabels: Record<string, string> = {
        "course": "Course Booking",
        "nvq": "NVQ Qualification",
        "cscs-card": "CSCS Card Application",
        "citb-test": "CITB Health & Safety Test",
        "package": "Training Package"
    };
    const bookingTypeLabel = bookingTypeLabels[booking.booking_type] || booking.booking_type || "Booking";

    // ─── Items table rows ───
    const items: any[] = booking.items || [];
    const itemsHtml = items.map((item: any, idx: number) => {
        const qty = item.quantity || 1;
        const unitPrice = Number(item.unit_price || 0);
        const itemTotal = unitPrice * qty;
        const itemExVat = itemTotal / 1.2;
        const itemVat = itemExVat * 0.2;
        return `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: left;">${idx + 1}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: left;">
                    <strong>${item.description || "TDA Skills Booking"}</strong>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${qty}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(itemExVat, booking.currency)}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(itemVat, booking.currency)} (20%)</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${formatPrice(itemTotal, booking.currency)}</td>
            </tr>
        `;
    }).join("");

    // ─── Build dynamic payment details rows ───
    let paymentDetailsRows = `
        <tr><td>Status</td><td style="text-transform:capitalize;">${paymentStatus.replace(/_/g, " ")}</td></tr>
        <tr><td>Provider</td><td>${paymentProvider}</td></tr>
    `;
    if (paymentNumber) {
        paymentDetailsRows += `<tr><td>Payment #</td><td>${paymentNumber}</td></tr>`;
    }
    if (paymentDate) {
        paymentDetailsRows += `<tr><td>Payment Date</td><td>${paymentDate}</td></tr>`;
    }
    if (transactionId) {
        paymentDetailsRows += `<tr><td>Transaction ID</td><td style="font-size:11px;word-break:break-all;">${transactionId}</td></tr>`;
    }
    if (cardBrand && cardLast4) {
        paymentDetailsRows += `<tr><td>Card</td><td style="text-transform:capitalize;">${cardBrand} •••• ${cardLast4}</td></tr>`;
        if (cardExpMonth && cardExpYear) {
            paymentDetailsRows += `<tr><td>Card Expiry</td><td>${String(cardExpMonth).padStart(2, "0")}/${cardExpYear}</td></tr>`;
        }
    }
    if (payment && payment.amount) {
        paymentDetailsRows += `<tr><td>Amount Paid</td><td><strong>${formatPrice(payment.amount, payment.currency || booking.currency)}</strong></td></tr>`;
    }
    if (refundedAmount > 0) {
        paymentDetailsRows += `<tr><td style="color:#c53030;">Refunded</td><td style="color:#c53030;font-weight:bold;">${formatPrice(refundedAmount, booking.currency)}</td></tr>`;
        if (refundReason) {
            paymentDetailsRows += `<tr><td>Refund Reason</td><td>${refundReason}</td></tr>`;
        }
        if (refundedAt) {
            const refundDate = new Date(refundedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
            paymentDetailsRows += `<tr><td>Refund Date</td><td>${refundDate}</td></tr>`;
        }
    }
    if (receiptUrl) {
        paymentDetailsRows += `<tr><td>Receipt</td><td><a href="${receiptUrl}" target="_blank" style="color:#001430;">View Receipt ↗</a></td></tr>`;
    }

    // ─── Build client address block ───
    let clientAddressHtml = `<p><strong>${payerName || "Client"}</strong></p>`;
    if (payerAddress) clientAddressHtml += `<p>${payerAddress}</p>`;
    if (payerPostal || payerCountry) clientAddressHtml += `<p>${[payerPostal, payerCountry].filter(Boolean).join(", ")}</p>`;
    if (payerEmail) clientAddressHtml += `<p style="margin-top:10px;"><strong>Email:</strong> ${payerEmail}</p>`;
    if (payerPhone) clientAddressHtml += `<p><strong>Phone:</strong> ${payerPhone}</p>`;

    // Candidate info (if different from payer)
    if (candidateName && candidateName !== payerName) {
        clientAddressHtml += `<p style="margin-top:10px;border-top:1px solid #eee;padding-top:8px;"><strong>Candidate:</strong> ${candidateName}</p>`;
    }

    // Company info
    if (companyName) {
        clientAddressHtml += `<p style="margin-top:10px;border-top:1px solid #eee;padding-top:8px;"><strong>Company:</strong> ${companyName}</p>`;
        if (companyReg) clientAddressHtml += `<p><strong>Reg No:</strong> ${companyReg}</p>`;
        if (companyAddress) clientAddressHtml += `<p>${companyAddress}</p>`;
        if (companyVat) clientAddressHtml += `<p><strong>VAT No:</strong> ${companyVat}</p>`;
    }

    // ─── Status badge ───
    const statusMap: Record<string, { label: string; cls: string }> = {
        succeeded: { label: "Paid", cls: "status-paid" },
        confirmed: { label: "Confirmed", cls: "status-paid" },
        completed: { label: "Completed", cls: "status-paid" },
        refunded: { label: "Refunded", cls: "status-refunded" },
        failed: { label: "Failed", cls: "status-unpaid" },
        cancelled: { label: "Cancelled", cls: "status-unpaid" },
    };
    const resolvedStatus = isPaid ? "succeeded" : (booking.status || paymentStatus);
    const badge = statusMap[resolvedStatus] || { label: "Payment Pending", cls: "status-unpaid" };

    // ─── Total row label based on payment status ───
    const totalLabel = isPaid ? "Total Paid" : (booking.status === "refunded" ? "Total Refunded" : "Total Due");

    // ─── Build HTML ───
    const printHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>VAT Invoice: ${booking.booking_number}</title>
            <meta charset="utf-8" />
            <style>
                body {
                    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    color: #333;
                    margin: 0;
                    padding: 40px;
                    line-height: 1.5;
                }
                .invoice-container {
                    max-width: 800px;
                    margin: 0 auto;
                    border: 1px solid #ddd;
                    padding: 40px;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.05);
                }
                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 2px solid #ffbb16;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .logo-section h1 {
                    margin: 0;
                    font-size: 28px;
                    color: #001430;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }
                .logo-section h1 span {
                    color: #ffbb16;
                }
                .logo-section p {
                    margin: 4px 0 0 0;
                    font-size: 12px;
                    color: #777;
                }
                .invoice-title {
                    text-align: right;
                }
                .invoice-title h2 {
                    margin: 0;
                    font-size: 24px;
                    color: #001430;
                    text-transform: uppercase;
                }
                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-top: 8px;
                }
                .status-paid {
                    background: #eefaf2;
                    color: #2e7d32;
                }
                .status-unpaid {
                    background: #fdf2f2;
                    color: #c53030;
                }
                .status-refunded {
                    background: #fff8e1;
                    color: #e65100;
                }
                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    margin-bottom: 40px;
                }
                .address-block h3 {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    text-transform: uppercase;
                    color: #777;
                    letter-spacing: 0.5px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                }
                .address-block p {
                    margin: 4px 0;
                    font-size: 13px;
                }
                .meta-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .meta-table td {
                    padding: 6px 0;
                    font-size: 13px;
                }
                .meta-table td:first-child {
                    color: #777;
                    font-weight: 600;
                    width: 120px;
                }
                .meta-table td:last-child {
                    font-weight: bold;
                    color: #333;
                }
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                .items-table th {
                    background: #f8f9fa;
                    padding: 12px;
                    font-size: 12px;
                    text-transform: uppercase;
                    color: #555;
                    font-weight: 700;
                    border-bottom: 2px solid #ddd;
                }
                .summary-container {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 40px;
                }
                .summary-table {
                    width: 300px;
                    border-collapse: collapse;
                }
                .summary-table td {
                    padding: 8px 12px;
                    font-size: 14px;
                }
                .summary-table tr.total-row td {
                    font-weight: 800;
                    font-size: 18px;
                    border-top: 2px solid #001430;
                    border-bottom: 2px double #001430;
                    color: #001430;
                }
                .footer-notice {
                    text-align: center;
                    border-top: 1px dashed #ddd;
                    padding-top: 20px;
                    margin-top: 50px;
                    font-size: 12px;
                    color: #777;
                }
                .footer-notice p {
                    margin: 4px 0;
                }
                
                @media print {
                    body {
                        padding: 0;
                        background: none;
                    }
                    .invoice-container {
                        border: none;
                        box-shadow: none;
                        padding: 0;
                        max-width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
                
                .no-print-bar {
                    max-width: 800px;
                    margin: 0 auto 20px auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #f8f9fa;
                    padding: 10px 20px;
                    border-radius: 6px;
                    border: 1px solid #e9ecef;
                }
                .print-btn {
                    background: #001430;
                    color: #fff;
                    border: none;
                    padding: 8px 16px;
                    font-weight: bold;
                    border-radius: 4px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                }
                .print-btn:hover {
                    background: #002855;
                }
            </style>
        </head>
        <body>
            <div class="no-print no-print-bar">
                <span style="font-size:13px; font-weight:600; color:#555;">VAT Invoice: ${booking.booking_number}</span>
                <button class="print-btn" onclick="window.print()">
                    Print / Save PDF
                </button>
            </div>
            
            <div class="invoice-container">
                <div class="invoice-header">
                    <div class="logo-section">
                        <h1>TDA<span>Skills</span></h1>
                        <p>Training & Development Academy</p>
                    </div>
                    <div class="invoice-title">
                        <h2>VAT Invoice</h2>
                        <span class="status-badge ${badge.cls}">
                            ${badge.label}
                        </span>
                    </div>
                </div>

                <div class="details-grid">
                    <div class="address-block">
                        <h3>From</h3>
                        <p><strong>TDA Skills Ltd</strong></p>
                        <p>24 Great North Road</p>
                        <p>London, N2 0NL</p>
                        <p>United Kingdom</p>
                        <p style="margin-top: 10px;"><strong>Email:</strong> info@tdaskills.co.uk</p>
                        <p><strong>Phone:</strong> 020 4571 0045</p>
                        <p><strong>VAT Reg No:</strong> GB 384 7291 04</p>
                    </div>
                    <div class="address-block">
                        <h3>To (Client / Bill To)</h3>
                        ${clientAddressHtml}
                    </div>
                </div>

                <div class="details-grid" style="margin-bottom: 25px; background: #fafafa; padding: 20px; border-radius: 6px;">
                    <div>
                        <h4 style="margin:0 0 8px 0; font-size:12px; text-transform:uppercase; color:#777;">Invoice Information</h4>
                        <table class="meta-table">
                            <tr>
                                <td>Invoice Number</td>
                                <td>${booking.booking_number}</td>
                            </tr>
                            <tr>
                                <td>Invoice Date</td>
                                <td>${invoiceDate}</td>
                            </tr>
                            <tr>
                                <td>Booking Type</td>
                                <td>${bookingTypeLabel}</td>
                            </tr>
                            ${confirmedAt ? `<tr><td>Confirmed</td><td>${confirmedAt}</td></tr>` : ""}
                            ${ns(booking.source) ? `<tr><td>Source</td><td>${ns(booking.source)}</td></tr>` : ""}
                        </table>
                    </div>
                    <div>
                        <h4 style="margin:0 0 8px 0; font-size:12px; text-transform:uppercase; color:#777;">Payment Details</h4>
                        <table class="meta-table">
                            ${paymentDetailsRows}
                        </table>
                    </div>
                </div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 5%; text-align: left;">#</th>
                            <th style="width: 45%; text-align: left;">Description</th>
                            <th style="width: 10%; text-align: center;">Qty</th>
                            <th style="width: 15%; text-align: right;">Unit Price (ex. VAT)</th>
                            <th style="width: 10%; text-align: right;">VAT</th>
                            <th style="width: 15%; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml || `<tr><td colspan="6" style="padding:20px;text-align:center;color:#999;">No items</td></tr>`}
                    </tbody>
                </table>

                <div class="summary-container">
                    <table class="summary-table">
                        ${discountAmount > 0 ? `
                        <tr>
                            <td style="text-align: left; color: #777;">Discount</td>
                            <td style="text-align: right; font-weight: 600; color: #2e7d32;">-${formatPrice(discountAmount, booking.currency)}</td>
                        </tr>
                        ` : ""}
                        <tr>
                            <td style="text-align: left; color: #777;">Subtotal (ex. VAT)</td>
                            <td style="text-align: right; font-weight: 600;">${formatPrice(subtotal, booking.currency)}</td>
                        </tr>
                        <tr>
                            <td style="text-align: left; color: #777;">VAT (20%)</td>
                            <td style="text-align: right; font-weight: 600;">${formatPrice(vat, booking.currency)}</td>
                        </tr>
                        <tr class="total-row">
                            <td style="text-align: left;">${totalLabel}</td>
                            <td style="text-align: right;">${formatPrice(totalAmount, booking.currency)}</td>
                        </tr>
                        ${refundedAmount > 0 ? `
                        <tr>
                            <td style="text-align: left; color: #c53030;">Refunded</td>
                            <td style="text-align: right; color: #c53030; font-weight: bold;">-${formatPrice(refundedAmount, booking.currency)}</td>
                        </tr>
                        <tr>
                            <td style="text-align: left; font-weight: 700;">Net Total</td>
                            <td style="text-align: right; font-weight: 700;">${formatPrice(totalAmount - refundedAmount, booking.currency)}</td>
                        </tr>
                        ` : ""}
                    </table>
                </div>

                <div class="footer-notice">
                    <p>Thank you for choosing TDA Skills for your training and certification requirements.</p>
                    <p>If you have any questions about this invoice, please contact our billing department.</p>
                    <p style="margin-top: 15px; font-size: 10px; color: #aaa;">Registered in England & Wales: 13524678. Registered Office: 24 Great North Road, London, N2 0NL.</p>
                </div>
            </div>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 300);
                }
            </script>
        </body>
        </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printHtml);
        printWindow.document.close();
    }
}
