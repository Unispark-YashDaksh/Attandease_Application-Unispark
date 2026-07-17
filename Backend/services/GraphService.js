class GraphService {
  constructor(config) {
    this.tenantId = config.tenantId;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.siteId = config.siteId;
    this.ticketsListId = config.ticketsListId;
    this._accessToken = null;
    this._tokenExpiresAt = 0;
  }

  async _getAccessToken() {
    if (this._accessToken && Date.now() < this._tokenExpiresAt) {
      return this._accessToken;
    }
    const url = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
    const body = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const resp = await fetch(url, {
        method: "POST",
        body,
        signal: controller.signal,
      });
      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`Token acquisition failed: ${resp.status} - ${err}`);
      }
      const data = await resp.json();
      this._accessToken = data.access_token;
      this._tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60000;
      return this._accessToken;
    } catch (error) {
      console.error("Token error details:", error.message);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async _graphRequest(method, path, body = null) {
    const token = await this._getAccessToken();
    const url = `https://graph.microsoft.com/v1.0${path}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const opts = { method, headers };
    if (body) {
      opts.body = JSON.stringify(body);
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      opts.signal = controller.signal;
      const resp = await fetch(url, opts);
      if (!resp.ok) {
        const err = await resp.text();
        const error = new Error(
          `Graph API ${method} ${path}: ${resp.status} - ${err}`,
        );
        error.status = resp.status;
        throw error;
      }
      if (resp.status === 204) return null;
      return resp.json();
    } catch (error) {
      console.error("Token error details:", error.message);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  // ------- USERS ----------------------
  async createUser(userData) {
    const data = await this._graphRequest("POST", "/users", {
      accountEnabled: true,
      displayName: userData.displayName,
      givenName: userData.givenName,
      surname: userData.surname,
      userPrincipalName: userData.userPrincipalName,
      mailNickname: userData.mailNickname,
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: userData.password,
      },
      department: userData.department || undefined,
      jobTitle: userData.jobTitle || undefined,
      usageLocation: userData.usageLocation || "IN",
    });
    if (userData.manager && data.id) {
      try {
        await this._graphRequest(
          "PUT",
          `/users/${data.id}/manager/@odata.$ref`,
          {
            "@odata.id": `https://graph.microsoft.com/v1.0/users/${userData.manager}`,
          },
        );
      } catch (error) {
        console.error("Failed to assign manager:", error.message);
      }
    }
    return {
      user_id: data.id,
      user_principal_name: data.userPrincipalName,
      display_name: data.displayName,
      mail: data.mail,
    };
  }

  async getUser(userId) {
    return this._graphRequest("GET", `/users/${userId}`);
  }

  async updateUser(userId, updates) {
    return this._graphRequest("PATCH", `/users/${userId}`, updates);
  }

  async disableUser(userId) {
    return this._graphRequest("PATCH", `/users/${userId}`, {
      accountEnabled: false,
    });
  }

  // --------- CALENDER ----------------------
  async scheduleEvent(eventData) {
    const body = {
      subject: eventData.subject,
      start: {
        dateTime: eventData.startDateTime,
        timeZone: eventData.timeZone || "Asia/Kolkata",
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: eventData.timeZone || "Asia/Kolkata",
      },
      attendees: (eventData.attendees || []).map((email) => ({
        emailAddress: { address: email },
        type: "required",
      })),
      isOnlineMeeting: true,
    };
    if (eventData.body) {
      body.body = {
        contentType: "text",
        content: eventData.body,
      };
    }
    if (eventData.location) {
      body.location = {
        displayName: eventData.location,
      };
    }
    const data = await this._graphRequest(
      "POST",
      `/users/${eventData.organizerId || "noreply@placeholder.com"}/calendar/events`,
      body,
    );
    return { event_id: data.id, web_link: data.webLink };
  }

  // ------- MAIL-----------------
  async sendEmail(emailData) {
    const body = {
      message: {
        subject: emailData.subject,
        body: { contentType: "Text", content: emailData.body },
        toRecipients: (emailData.to || []).map((email) => ({
          emailAddress: { address: email },
        })),
      },
      saveToSentItems: true,
    };
    return this._graphRequest(
      "POST",
      `/users/${emailData.fromId || "noreply@placeholder.com"}/sendMail`,
      body,
    );
  }

  // --------SHAREPOINT LISTS (TICKETS)`

  async createTicket(category, fields) {
    const data = await this._graphRequest(
      "POST",
      `/sites/${this.siteId}/lists/${this.ticketsListId}/items`,
      { fields: { ...fields, Category: category } },
    );
    return { ticket_id: data.id, ...data.fields };
  }

  async getTickets(category) {
    const data = await this._graphRequest(
      "GET",
      `/sites/${this.siteId}/lists/${this.ticketsListId}/items?expand=fields`,
    );
    return (data.value || []).map((item) => ({
      id: item.id,
      ...item.fields,
    }));
  }

  async getTicketsById(itemId) {
    const data = await this._graphRequest(
      "GET",
      `/sites/${this.siteId}/lists/${this.ticketsListId}/items/${itemId}?expand=fields`,
    );
    return { id: data.id, ...data.fields };
  }

  async upDateTicket(category, itemId, fields) {
    return this._graphRequest(
      "PATCH",
      `/sites/${this.siteId}/lists/${this.ticketsListId}/items/${itemId}/fields`,
      fields,
    );
  }

  async deleteTicket(category, itemId) {
    return this._graphRequest(
      "DELETE",
      `/sites/${this.siteId}/lists/${this.ticketsListId}/items/${itemId}`,
    );
  }
}

module.exports = GraphService;
